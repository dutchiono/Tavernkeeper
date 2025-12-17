#!/usr/bin/env tsx
/**
 * Architecture Analysis Script
 *
 * Analyzes the codebase structure:
 * - Generates import dependency graph
 * - Identifies circular dependencies
 * - Finds unused exports
 * - Finds orphaned files
 * - Generates architecture diagram (Mermaid)
 *
 * Usage:
 *   tsx scripts/analyze-architecture.ts
 */

import madge from 'madge';
import fg from 'fast-glob';
import path from 'path';
import fs from 'fs';
import { TEST_POLICY } from '../test-policy';

interface AnalysisResult {
  circularDependencies: string[][];
  orphanedFiles: string[];
  unusedExports: string[];
  dependencyGraph: any;
  statistics: {
    totalFiles: number;
    totalImports: number;
    circularCount: number;
    orphanCount: number;
  };
}

async function analyzeArchitecture(): Promise<AnalysisResult> {
  console.log('🔍 Analyzing architecture...\n');

  const rootDir = path.resolve(__dirname, '..');
  const sourceFiles = await fg(['apps/**/*.ts', 'packages/**/*.ts'], {
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.d.ts',
      '**/__tests__/**',
      '**/test/**',
      '**/scripts/**',
    ],
    absolute: true,
    cwd: rootDir,
  });

  console.log(`📁 Found ${sourceFiles.length} source files\n`);

  // Use madge to analyze dependencies
  const res = await madge(sourceFiles, {
    fileExtensions: ['ts', 'tsx'],
    excludeRegExp: [
      /\.d\.ts$/,
      /node_modules/,
      /dist/,
      /__tests__/,
      /test/,
    ],
  });

  // Get circular dependencies
  const circular = res.circular();
  console.log(`🔄 Circular Dependencies: ${circular.length}`);
  if (circular.length > 0) {
    console.log('   Circular dependency chains:');
    circular.forEach((chain, i) => {
      console.log(`   ${i + 1}. ${chain.join(' → ')}`);
    });
  }
  console.log('');

  // Find orphaned files (files not imported by anyone)
  const dependencyGraph = res.obj();
  const allImportedFiles = new Set<string>();

  // Collect all files that are imported
  for (const [file, imports] of Object.entries(dependencyGraph)) {
    if (Array.isArray(imports)) {
      imports.forEach(imp => allImportedFiles.add(imp));
    }
  }

  // Find files that are not imported
  const orphanedFiles: string[] = [];
  for (const file of sourceFiles) {
    const relativeFile = path.relative(rootDir, file);

    // Skip if it's an entry point (index.ts, main.ts, etc.)
    const basename = path.basename(file, path.extname(file));
    if (basename === 'index' || basename === 'main') {
      continue;
    }

    // Skip if it's allowed to be untested
    if (TEST_POLICY.allowedUntestedGlobs.some(pattern => {
      const regex = new RegExp(
        pattern
          .replace(/\*\*/g, '.*')
          .replace(/\*/g, '[^/]*')
          .replace(/\//g, '[/\\\\]')
      );
      return regex.test(relativeFile.replace(/\\/g, '/'));
    })) {
      continue;
    }

    // Check if file is imported
    if (!allImportedFiles.has(file) && !dependencyGraph[file]) {
      orphanedFiles.push(relativeFile);
    }
  }

  console.log(`📦 Orphaned Files: ${orphanedFiles.length}`);
  if (orphanedFiles.length > 0) {
    console.log('   Files not imported anywhere:');
    orphanedFiles.slice(0, 20).forEach(file => {
      console.log(`   - ${file}`);
    });
    if (orphanedFiles.length > 20) {
      console.log(`   ... and ${orphanedFiles.length - 20} more`);
    }
  }
  console.log('');

  // Generate statistics
  const totalImports = Object.values(dependencyGraph).reduce((sum, imports) => {
    return sum + (Array.isArray(imports) ? imports.length : 0);
  }, 0);

  const statistics = {
    totalFiles: sourceFiles.length,
    totalImports,
    circularCount: circular.length,
    orphanCount: orphanedFiles.length,
  };

  console.log('📊 Statistics:');
  console.log(`   Total files: ${statistics.totalFiles}`);
  console.log(`   Total imports: ${statistics.totalImports}`);
  console.log(`   Circular dependencies: ${statistics.circularCount}`);
  console.log(`   Orphaned files: ${statistics.orphanCount}`);
  console.log('');

  // Generate Mermaid diagram
  console.log('📈 Generating dependency graph...');
  const mermaidGraph = generateMermaidGraph(dependencyGraph, sourceFiles);

  const outputDir = path.join(rootDir, 'docs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const mermaidFile = path.join(outputDir, 'architecture-dependency-graph.md');
  fs.writeFileSync(mermaidFile, mermaidGraph);
  console.log(`   ✅ Graph saved to ${path.relative(rootDir, mermaidFile)}\n`);

  // Generate JSON report
  const report: AnalysisResult = {
    circularDependencies: circular,
    orphanedFiles,
    unusedExports: [], // Would require AST parsing to detect
    dependencyGraph,
    statistics,
  };

  const reportFile = path.join(outputDir, 'architecture-analysis.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`   ✅ Report saved to ${path.relative(rootDir, reportFile)}\n`);

  return report;
}

function generateMermaidGraph(dependencyGraph: any, sourceFiles: string[]): string {
  const rootDir = path.resolve(__dirname, '..');

  let mermaid = `# Architecture Dependency Graph\n\n`;
  mermaid += `Generated: ${new Date().toISOString()}\n\n`;
  mermaid += `\`\`\`mermaid\n`;
  mermaid += `graph TD\n`;

  // Group files by directory
  const filesByDir = new Map<string, string[]>();
  for (const file of sourceFiles) {
    const relativeFile = path.relative(rootDir, file);
    const dir = path.dirname(relativeFile);
    if (!filesByDir.has(dir)) {
      filesByDir.set(dir, []);
    }
    filesByDir.get(dir)!.push(relativeFile);
  }

  // Create nodes for major directories
  const majorDirs = Array.from(filesByDir.keys())
    .filter(dir => filesByDir.get(dir)!.length > 3)
    .slice(0, 20); // Limit to top 20 directories

  for (const dir of majorDirs) {
    const dirId = dir.replace(/[^a-zA-Z0-9]/g, '_');
    mermaid += `    ${dirId}["${dir}"]\n`;
  }

  // Add edges for dependencies between major directories
  const addedEdges = new Set<string>();
  for (const [file, imports] of Object.entries(dependencyGraph)) {
    if (Array.isArray(imports)) {
      const fileDir = path.dirname(path.relative(rootDir, file));
      for (const imp of imports) {
        const impDir = path.dirname(path.relative(rootDir, imp));
        if (fileDir !== impDir && majorDirs.includes(fileDir) && majorDirs.includes(impDir)) {
          const edgeKey = `${fileDir}->${impDir}`;
          if (!addedEdges.has(edgeKey)) {
            const fileDirId = fileDir.replace(/[^a-zA-Z0-9]/g, '_');
            const impDirId = impDir.replace(/[^a-zA-Z0-9]/g, '_');
            mermaid += `    ${fileDirId} --> ${impDirId}\n`;
            addedEdges.add(edgeKey);
          }
        }
      }
    }
  }

  mermaid += `\`\`\`\n`;

  return mermaid;
}

// Run analysis
analyzeArchitecture()
  .then(() => {
    console.log('✅ Architecture analysis complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error during analysis:', error);
    process.exit(1);
  });

