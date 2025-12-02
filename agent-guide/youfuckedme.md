
PS C:\Users\epj33\Desktop\InnKeeper> git add .
warning: in the working copy of '.gitignore', LF will be replaced by CRLF the next time Git touches it
PS C:\Users\epj33\Desktop\InnKeeper> got commit -m "render deplyment"
got : The term 'got' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling
of the name, or if a path was included, verify that the path is correct and try again.
At line:1 char:1
+ got commit -m "render deplyment"
+ ~~~
    + CategoryInfo          : ObjectNotFound: (got:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException

PS C:\Users\epj33\Desktop\InnKeeper> git commit -m "render"
[main 1488731] render
 560 files changed, 113485 insertions(+), 8607 deletions(-)
 create mode 100644 .github/workflows/discord-bot.yml
 create mode 100644 .github/workflows/web-app.yml
 create mode 100644 HANDOVER.md
 delete mode 100644 NOT.gitignore
 create mode 100644 RENDER_DEPLOYMENT.md
 create mode 100644 TavernKeeperPFP.png
 create mode 100644 agent-guide/reorg.md
 create mode 100644 apps/web/Dockerfile.worker
 create mode 100644 apps/web/E2E_TEST_COVERAGE.md
 create mode 100644 apps/web/TEST_COVERAGE_SUMMARY.md
 create mode 100644 apps/web/__tests__/CONTRACT_TESTS.md
 create mode 100644 apps/web/__tests__/README.md
 create mode 100644 apps/web/__tests__/api/heroes-tokenId.test.ts
 create mode 100644 apps/web/__tests__/api/heroes.test.ts
 create mode 100644 apps/web/__tests__/api/inventory-unequip.test.ts
 create mode 100644 apps/web/__tests__/api/loot-claim.test.ts
 create mode 100644 apps/web/__tests__/api/marketplace-buy.test.ts
 create mode 100644 apps/web/__tests__/api/marketplace-list.test.ts
 create mode 100644 apps/web/__tests__/api/marketplace-listings.test.ts
 create mode 100644 apps/web/__tests__/api/parties-id.test.ts
 create mode 100644 apps/web/__tests__/api/parties-invite.test.ts
 create mode 100644 apps/web/__tests__/api/parties-join.test.ts
 create mode 100644 apps/web/__tests__/api/parties.test.ts
 create mode 100644 apps/web/__tests__/services/tavernKeeperService.test.ts
 create mode 100644 apps/web/app/(miniapp)/layout.tsx
 create mode 100644 apps/web/app/(miniapp)/miniapp/page.tsx
 rename apps/web/app/{ => (web)}/hero-builder/page.tsx (87%)
 create mode 100644 apps/web/app/(web)/layout.tsx
 rename apps/web/app/{ => (web)}/map/page.tsx (100%)
 rename apps/web/app/{ => (web)}/marketplace/page.tsx (84%)
 create mode 100644 apps/web/app/(web)/page.tsx
 rename apps/web/app/{ => (web)}/party-invite/[code]/page.tsx (97%)
 create mode 100644 apps/web/app/(web)/party/page.tsx
 rename apps/web/app/{ => (web)}/run/[id]/page.tsx (95%)
 create mode 100644 apps/web/app/(web)/tavern-regulars/page.tsx
 create mode 100644 apps/web/app/(web)/town-posse/page.tsx
 create mode 100644 apps/web/app/actions/aiActions.ts
 create mode 100644 apps/web/app/api/heroes/owned/route.ts
 create mode 100644 apps/web/app/api/heroes/token/route.ts
 create mode 100644 apps/web/app/api/parties/[id]/status/route.ts
 create mode 100644 apps/web/app/api/pricing/sign/route.ts
 create mode 100644 apps/web/app/api/runs/[id]/events/route.ts
 delete mode 100644 apps/web/app/miniapp/page.tsx
 delete mode 100644 apps/web/app/page.tsx
 delete mode 100644 apps/web/app/party/page.tsx
 create mode 100644 apps/web/build_log.txt
 create mode 100644 apps/web/build_log_2.txt
 create mode 100644 apps/web/build_log_3.txt
 create mode 100644 apps/web/build_log_4.txt
 create mode 100644 apps/web/build_log_5.txt
 create mode 100644 apps/web/build_output_10.txt
 create mode 100644 apps/web/build_output_11.txt
 create mode 100644 apps/web/build_output_7.txt
 create mode 100644 apps/web/build_output_8.txt
 create mode 100644 apps/web/build_output_9.txt
 create mode 100644 apps/web/components/RecruitHeroView.tsx
 create mode 100644 apps/web/components/TavernKeeperBuilder.tsx
 create mode 100644 apps/web/components/TheCellarView.tsx
 create mode 100644 apps/web/components/TheOfficeMiniapp.tsx
 create mode 100644 apps/web/components/TheOfficeView.tsx
 create mode 100644 apps/web/components/heroes/HeroEditor.tsx
 create mode 100644 apps/web/components/party/PartyModeSelector.tsx
 create mode 100644 apps/web/components/party/PartySelector.tsx
 create mode 100644 apps/web/components/party/PublicPartyLobby.tsx
 create mode 100644 apps/web/e2e/blockchain-interaction.spec.ts
 create mode 100644 apps/web/e2e/fixtures/web3-fixture.ts
 create mode 100644 apps/web/e2e/inventory-loot.spec.ts
 create mode 100644 apps/web/e2e/marketplace.spec.ts
 create mode 100644 apps/web/e2e/miniapp-comprehensive.spec.ts
 create mode 100644 apps/web/e2e/mint-tavern-keeper.spec.ts
 create mode 100644 apps/web/e2e/party-invite.spec.ts
 create mode 100644 apps/web/e2e/webapp-comprehensive.spec.ts
 create mode 100644 apps/web/lib/chains.ts
 create mode 100644 apps/web/lib/contracts/addresses.ts
 create mode 100644 apps/web/lib/game-mechanics/dungeon/DungeonGenerator.ts
 create mode 100644 apps/web/lib/game-mechanics/dungeon/types.ts
 create mode 100644 apps/web/lib/game-mechanics/items/ItemGenerator.ts
 create mode 100644 apps/web/lib/game-mechanics/items/test-generator.ts
 create mode 100644 apps/web/lib/game-mechanics/items/types.ts
 create mode 100644 apps/web/lib/game-mechanics/loot/LootManager.ts
 create mode 100644 apps/web/lib/game-mechanics/loot/types.ts
 create mode 100644 apps/web/lib/game-mechanics/monsters/MonsterFactory.ts
 create mode 100644 apps/web/lib/game-mechanics/monsters/types.ts
 create mode 100644 apps/web/lib/game-mechanics/prompts/dm-prompt.ts
 create mode 100644 apps/web/lib/game-mechanics/prompts/hero-prompt.ts
 create mode 100644 apps/web/lib/game-mechanics/prompts/tavern-keeper-prompt.ts
 create mode 100644 apps/web/lib/game-mechanics/simulation.ts
 create mode 100644 apps/web/lib/game-mechanics/utils/seeded-rng.ts
 create mode 100644 apps/web/lib/hooks/usePartyStatus.ts
 create mode 100644 apps/web/lib/hooks/useRunEvents.ts
 create mode 100644 apps/web/lib/hooks/useRunStatus.ts
 create mode 100644 apps/web/lib/services/eventParser.ts
 create mode 100644 apps/web/lib/services/farcasterWallet.ts
 create mode 100644 apps/web/lib/services/monPriceService.ts
 create mode 100644 apps/web/lib/services/rpgService.ts
 create mode 100644 apps/web/lib/services/runService.ts
 create mode 100644 apps/web/lib/services/tavernRegularsService.ts
 create mode 100644 apps/web/lib/services/theCellarService.ts
 create mode 100644 apps/web/lib/services/townPosseService.ts
 create mode 100644 apps/web/lib/utils/farcasterDetection.ts
 delete mode 100644 apps/web/lib/wagmi.ts
 create mode 100644 apps/web/public/.well-known/farcaster.json
 create mode 100644 apps/web/public/farcaster.json
 create mode 100644 apps/web/public/sprites/office_bg.png
 create mode 100644 apps/web/scripts/debug-pinata-3.ts
 create mode 100644 apps/web/scripts/debug-pinata.ts
 create mode 100644 apps/web/scripts/set-network.js
 create mode 100644 apps/web/scripts/test-pinata-upload.ts
 delete mode 100644 apps/web/services/geminiService.ts
 delete mode 100644 apps/web/test-results/vitest-results.json
 rename agent-guide/webVminiapp.ms => assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-09cf1479-d2de-4cec-8e38-8153e9b4fe91.png (100%)
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-0d13e023-0b02-49e4-9734-548baae68e32.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-130ce868-c7d5-4214-aef2-8dcf602f8d2d.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-14650cd2-f886-4c31-8b62-d01546363339.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-37fba639-9c19-4540-bb5c-44aaad9ba581.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-3a4d854c-c8a5-47a5-83c9-8067907513b1.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-3d945e92-21ba-4ee1-95ea-03a78ce5d021.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-4ab7ce43-7dd8-4969-94ba-42e3d8d836b4.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-500697c6-9723-46db-a48a-feedd3e7df4d.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-518029a1-e8b2-41ac-8655-6d4dbfa91a15.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-5de82870-b386-4a0c-b65f-fe93539e865d.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-69a02aec-5ec0-4b0f-9bfc-91c7d24bbfac.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-6dd7ffe5-1332-4480-886c-95bc2e110711.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-83ca9520-1b7c-4afc-be36-88c69c2e8707.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-8e4ffea1-a41d-42aa-b51a-becd2c4b5e82.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-9140d689-b505-4991-9e49-e6fc1708c898.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-94f4f2d0-fcfe-4ff0-93cf-c66daca1f8d1.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-9b29802f-1b49-4305-a98f-ef4bd41e671f.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-9b7a70e1-ec43-4f9e-af55-423e88b0e811.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-9ba53a2b-a00b-46c6-bd9e-de0405d8b659.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-a9bcbc18-dab0-437d-8f43-9d6051e5cf6c.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-ac07a926-9473-4a5e-adae-bb476a2a707b.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-ae111ab6-c732-4ec4-bbed-ceed16c4e5a6.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-b4412ff2-20d7-406d-aa07-ff925d782e97.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-bc215570-5171-4af8-9bb6-46bf9f008d11.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-bcb01087-010c-4671-9139-592981df8894.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-bf0a9a69-c6b8-42aa-9ec8-b5b2a8a3b865.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-d0536733-8c22-4baa-8b75-ce8516a13b91.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-e1bed8bd-8bab-4fac-861e-a86b36d70ed2.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-eab5d787-16c5-42d6-a370-ba4dfbf7070c.png
 create mode 100644 assets/c__Users_epj33_AppData_Roaming_Cursor_User_workspaceStorage_39069d8bb1cf46960c0b60b4b1f115dd_images_image-fb97367d-8ab4-45b8-bc04-b386ff7f86ff.png
 create mode 100644 docs/README.md
 rename {agent-guide => docs/internal/agent-guide}/IMPLEMENTATION_PLAN.md (100%)
 rename {agent-guide => docs/internal/agent-guide}/README.md (100%)
 create mode 100644 docs/internal/agent-guide/TODOSTILL.md
 create mode 100644 docs/internal/agent-guide/UUID.update.md
 rename {agent-guide => docs/internal/agent-guide}/api-keys.md (82%)
 create mode 100644 docs/internal/agent-guide/conversation.md
 create mode 100644 docs/internal/agent-guide/discord-bot-docs-integration-handoff.md
 create mode 100644 docs/internal/agent-guide/discord-bot-progress.md
 create mode 100644 docs/internal/agent-guide/dontbeafuckignreatrd.md
 create mode 100644 docs/internal/agent-guide/dungeonmastertkupdate.md
 rename {agent-guide => docs/internal/agent-guide}/eliza-setup.md (100%)
 rename {agent-guide => docs/internal/agent-guide}/engine-updates-frontend.md (100%)
 rename {agent-guide => docs/internal/agent-guide}/frontend-architect-checkin.md (100%)
 rename {agent-guide => docs/internal/agent-guide}/frontend-checkin-ui-update.md (100%)
 rename {agent-guide => docs/internal/agent-guide}/frontend-designer.md (100%)
 rename {agent-guide => docs/internal/agent-guide}/game-design.md (100%)
 rename {agent-guide => docs/internal/agent-guide}/keeptoken.md (100%)
 create mode 100644 docs/internal/agent-guide/lcaol.testnet.md
 rename {agent-guide => docs/internal/agent-guide}/multpartyplan.md (100%)
 create mode 100644 docs/internal/agent-guide/nft-party-system-implementation.md
 create mode 100644 docs/internal/agent-guide/production-deployment.md
 create mode 100644 docs/internal/agent-guide/rag-integration-guide.md
 create mode 100644 docs/internal/agent-guide/reorg.md
 create mode 100644 docs/internal/agent-guide/unified-agent-architecture.md
 create mode 100644 docs/internal/agent-guide/webVminiapp.md
 rename {arc => docs/internal/architecture}/Architecture.md (100%)
 rename {arc => docs/internal/architecture}/agent-system.md (100%)
 rename {arc => docs/internal/architecture}/backend-spec.md (100%)
 rename {arc => docs/internal/architecture}/dev-setup.md (100%)
 rename {arc => docs/internal/architecture}/dungeon-engine.md (100%)
 rename {arc => docs/internal/architecture}/farcaster-miniapp.md (100%)
 rename {arc => docs/internal/architecture}/frontend-spec.md (100%)
 rename {contributions => docs/internal/contributions}/CONTRIBUTION_GUIDE.md (100%)
 rename {contributions => docs/internal/contributions}/CONTRIBUTION_TEMPLATE.md (100%)
 rename {contributions => docs/internal/contributions}/README.md (100%)
 rename {contributions => docs/internal/contributions}/game-logging-system/DESIGN.md (100%)
 rename {contributions => docs/internal/contributions}/game-logging-system/README.md (100%)
 rename {contributions => docs/internal/contributions}/game-logging-system/code/database/migration.sql (100%)
 rename {contributions => docs/internal/contributions}/game-logging-system/code/engine/logging.ts (100%)
 rename {contributions => docs/internal/contributions}/game-logging-system/code/services/loggingService.ts (100%)
 rename {contributions => docs/internal/contributions}/game-logging-system/code/types/logging.ts (100%)
 rename {contributions => docs/internal/contributions}/game-logging-system/examples/usage-examples.ts (100%)
 create mode 100644 docs/internal/contributions/procedural-item-generation/DESIGN.md
 create mode 100644 docs/internal/contributions/procedural-item-generation/INTEGRATION_NOTES.md
 create mode 100644 docs/internal/contributions/procedural-item-generation/README.md
 create mode 100644 docs/internal/contributions/procedural-item-generation/code/README.md
 create mode 100644 docs/internal/contributions/procedural-item-generation/code/generators/index.ts
 create mode 100644 docs/internal/contributions/procedural-item-generation/code/generators/item-generator.ts
 create mode 100644 docs/internal/contributions/procedural-item-generation/code/generators/seeded-rng.ts
 create mode 100644 docs/internal/contributions/procedural-item-generation/code/types/item-generation.ts
 create mode 100644 docs/internal/contributions/procedural-item-generation/examples/usage-examples.ts
 create mode 100644 docs/internal/contributions/procedural-item-generation/tools/README.md
 create mode 100644 docs/internal/contributions/procedural-item-generation/tools/item-generator-tool.html
 rename {contributions => docs/internal/contributions}/world-content-hierarchy/DESIGN.md (100%)
 rename {contributions => docs/internal/contributions}/world-content-hierarchy/README.md (100%)
 rename {contributions => docs/internal/contributions}/world-content-hierarchy/code/database/migration.sql (100%)
 rename {contributions => docs/internal/contributions}/world-content-hierarchy/code/services/worldContentService.ts (100%)
 rename {contributions => docs/internal/contributions}/world-content-hierarchy/code/types/world-content.ts (100%)
 rename {contributions => docs/internal/contributions}/world-content-hierarchy/code/world-content/content-hierarchy.ts (100%)
 rename {contributions => docs/internal/contributions}/world-content-hierarchy/code/world-content/lore-generator.ts (100%)
 rename {contributions => docs/internal/contributions}/world-content-hierarchy/code/world-content/provenance-tracker.ts (100%)
 rename {contributions => docs/internal/contributions}/world-content-hierarchy/code/world-content/world-manager.ts (100%)
 rename {contributions => docs/internal/contributions}/world-content-hierarchy/examples/usage-examples.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/DESIGN.md (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/README.md (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/generators/conceptual-generator.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/generators/cosmic-generator.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/generators/demigod-generator.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/generators/geography-generator.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/generators/lineage-generator.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/generators/mortal-generator.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/generators/organization-generator.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/generators/primordial-generator.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/generators/standout-generator.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/generators/world-generator.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/templates/world-templates.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/code/types/world-generation.ts (100%)
 rename {contributions => docs/internal/contributions}/world-generation-system/examples/usage-examples.ts (100%)
 create mode 100644 docs/internal/deployment/HOSTING_ANALYSIS.md
 create mode 100644 docs/internal/deployment/LOCALHOST_DEPLOYMENT.md
 create mode 100644 docs/internal/development/LOCAL_BLOCKCHAIN_SETUP.md
 create mode 100644 docs/internal/development/LOCAL_SIMULATION_PLAN.md
 create mode 160000 docs/internal/inspiration/donut demos/donut-miner
 create mode 160000 docs/internal/inspiration/donut demos/donut-miner-miniapp
 create mode 160000 docs/internal/inspiration/donut demos/donut-miner-subgraph
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/.gitignore
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/App.tsx
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/README.md
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/components/ForgeComponents.tsx
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/components/GenAIPreview.tsx
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/components/HeroBuilder.tsx
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/components/PixelComponents.tsx
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/components/SpritePreview.tsx
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/components/TavernKeeperBuilder.tsx
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/index.html
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/index.tsx
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/metadata.json
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/package.json
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/services/aiService.ts
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/services/spriteService.ts
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/tsconfig.json
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/types.ts
 create mode 100644 docs/internal/inspiration/innkeeper-hero-forge (1)/vite.config.ts
 create mode 100644 docs/internal/inspiration/m00n-cabal/ANALYSIS.md
 create mode 100644 docs/internal/inspiration/m00n-cabal/ARCHITECTURE.md
 create mode 100644 docs/internal/inspiration/m00n-cabal/CLONE_REPO.md
 create mode 100644 docs/internal/inspiration/m00n-cabal/CONCEPT_MAPPING.md
 create mode 100644 docs/internal/inspiration/m00n-cabal/CONTRACT_REFERENCE.md
 create mode 100644 docs/internal/inspiration/m00n-cabal/FINDINGS_SUMMARY.md
 create mode 100644 docs/internal/inspiration/m00n-cabal/INTEGRATION_OPPORTUNITIES.md
 create mode 100644 docs/internal/inspiration/m00n-cabal/INTEGRATION_PLAN.md
 create mode 100644 docs/internal/inspiration/m00n-cabal/LP_MECHANICS.md
 create mode 100644 docs/internal/inspiration/m00n-cabal/README.md
 create mode 160000 docs/internal/inspiration/m00n-cabal/m00n-cabal
 rename {research => docs/internal/research}/analysis/DONUT_MINER_ANALYSIS.md (100%)
 rename {research => docs/internal/research}/analysis/IMPLEMENTATION_ROADMAP.md (100%)
 rename {research => docs/internal/research}/analysis/README.md (100%)
 rename {research => docs/internal/research}/analysis/TAVERNKEEPER_SYSTEM_DESIGN.md (100%)
 create mode 100644 packages/contracts/.npmrc
 create mode 100644 packages/contracts/ADDRESS_CONFIGURATION.md
 create mode 100644 packages/contracts/CHECKLIST_CELLARHOOK.md
 create mode 100644 packages/contracts/CHECKLIST_CELLARZAP.md
 create mode 100644 packages/contracts/CHECKLIST_DEPLOYMENT.md
 create mode 100644 packages/contracts/CHECKLIST_FRONTEND.md
 create mode 100644 packages/contracts/CHECKLIST_TESTING.md
 create mode 100644 packages/contracts/CLEANUP_PLAN.md
 create mode 100644 packages/contracts/COMPLETE_DOCUMENTATION.md
 create mode 100644 packages/contracts/DEPLOY_NOW.md
 create mode 100644 packages/contracts/UPGRADE_MASTER_PLAN.md
 create mode 100644 packages/contracts/UUPS_CONVERSION_NOTES.md
 create mode 100644 packages/contracts/VERIFICATION_REPORT.md
 delete mode 100644 packages/contracts/artifacts/build-info/255e367869626d3f4fb02f3b38995e64.json
 delete mode 100644 packages/contracts/artifacts/build-info/c09605027e7c214c86fc546cd1ee8a95.json
 delete mode 100644 packages/contracts/artifacts/contracts/GoldToken.sol/GoldToken.dbg.json
 delete mode 100644 packages/contracts/artifacts/contracts/GoldToken.sol/GoldToken.json
 create mode 100644 packages/contracts/artifacts/contracts/MockERC20.sol/MockERC20.dbg.json
 create mode 100644 packages/contracts/artifacts/contracts/MockERC20.sol/MockERC20.json
 create mode 100644 packages/contracts/cellar_check_output.txt
 create mode 100644 packages/contracts/contracts/CellarZapV4.sol
 create mode 100644 packages/contracts/contracts/Create2Factory.sol
 create mode 100644 packages/contracts/contracts/DungeonGatekeeper.sol
 delete mode 100644 packages/contracts/contracts/GoldToken.sol
 create mode 100644 packages/contracts/contracts/MockERC20.sol
 create mode 100644 packages/contracts/contracts/TavernRegularsManager.sol
 create mode 100644 packages/contracts/contracts/TownPosseManager.sol
 create mode 100644 packages/contracts/contracts/V4DependencyHelper.sol
 create mode 100644 packages/contracts/contracts/hooks/CellarHook.sol
 create mode 100644 packages/contracts/contracts/interfaces/IUniswapV2Router02.sol
 create mode 100644 packages/contracts/contracts/legacy/CellarZap.sol
 create mode 100644 packages/contracts/contracts/legacy/TheCellar.sol
 create mode 100644 packages/contracts/deploy_output.txt
 create mode 100644 packages/contracts/deployment-info-v4.json
 create mode 100644 packages/contracts/deployment-info.json
 create mode 100644 packages/contracts/docs/BAR_REGULARS_SPEC.md
 create mode 100644 packages/contracts/docs/CELLAR_INTEGRATION.md
 create mode 100644 packages/contracts/docs/COMPLETION_SUMMARY.md
 create mode 100644 packages/contracts/docs/DEPLOYMENT_PLAN.md
 create mode 100644 packages/contracts/docs/IMPLEMENTATION_TRACKER.md
 create mode 100644 packages/contracts/docs/README.md
 create mode 100644 packages/contracts/docs/SUPERVISOR_REVIEW.md
 create mode 100644 packages/contracts/docs/TOWN_POSSE_SPEC.md
 create mode 100644 packages/contracts/package-lock.json
 create mode 100644 packages/contracts/scripts/archive/check_cellar_state.ts
 create mode 100644 packages/contracts/scripts/archive/check_potbalance.ts
 create mode 100644 packages/contracts/scripts/archive/consolidate_funds.ts
 create mode 100644 packages/contracts/scripts/archive/deploy_cellarhook_uups.ts
 create mode 100644 packages/contracts/scripts/archive/deploy_cellarzap_uups.ts
 create mode 100644 packages/contracts/scripts/archive/deploy_tavernkeeper_fix.ts
 create mode 100644 packages/contracts/scripts/archive/deploy_v4_all.ts
 create mode 100644 packages/contracts/scripts/archive/deploy_v4_final.ts
 create mode 100644 packages/contracts/scripts/archive/deploy_v4_resume.ts
 create mode 100644 packages/contracts/scripts/archive/deploy_v4_zap_update.ts
 create mode 100644 packages/contracts/scripts/archive/fix_cellar_potbalance.ts
 rename packages/contracts/scripts/{ => archive}/fundTestWallets.ts (100%)
 rename packages/contracts/scripts/{ => archive}/generateTestWallets.ts (100%)
 create mode 100644 packages/contracts/scripts/archive/start-local-dev.ts
 create mode 100644 packages/contracts/scripts/archive/test-new-contracts.ts
 create mode 100644 packages/contracts/scripts/archive/test_simple.ts
 rename packages/contracts/scripts/{ => archive}/testnetWorkflow.ts (83%)
 create mode 100644 packages/contracts/scripts/archive/upgrade_rpg_system.ts
 create mode 100644 packages/contracts/scripts/archive/upgrade_rpg_v2.ts
 create mode 100644 packages/contracts/scripts/archive/upgrade_signature_pricing.ts
 create mode 100644 packages/contracts/scripts/archive/upgrade_v4_contracts.ts
 delete mode 100644 packages/contracts/scripts/deploy.ts
 create mode 100644 packages/contracts/scripts/deploy_localhost.ts
 create mode 100644 packages/contracts/scripts/fundDeployer.ts
 create mode 100644 packages/contracts/scripts/updateDeploymentTracker.ts
 create mode 100644 packages/contracts/scripts/updateFrontend.ts
 delete mode 100644 packages/contracts/scripts/upgrade.ts
 create mode 100644 packages/contracts/test/FullSystem.test.ts
 create mode 100644 packages/contracts/typechain-types/contracts/MockERC20.ts
 create mode 100644 packages/contracts/typechain-types/contracts/TheCellar.ts
 create mode 100644 packages/contracts/typechain-types/factories/contracts/MockERC20__factory.ts
 create mode 100644 packages/contracts/typechain-types/factories/contracts/TheCellar__factory.ts
 delete mode 100644 packages/contracts/wallets/.gitignore
 create mode 100644 packages/discord-bot/.gitignore
 create mode 100644 packages/discord-bot/DISCORD_SETUP.md
 create mode 100644 packages/discord-bot/Dockerfile
 create mode 100644 packages/discord-bot/HUMAN_VERIFICATION_SETUP.md
 create mode 100644 packages/discord-bot/README.md
 create mode 100644 packages/discord-bot/SETUP_COMPLETE.md
 create mode 100644 packages/discord-bot/SETUP_SAFETY_ANALYSIS.md
 create mode 100644 packages/discord-bot/TROUBLESHOOTING.md
 create mode 100644 packages/discord-bot/UPGRADE_SUMMARY.md
 create mode 100644 packages/discord-bot/VERIFICATION_FLOW.md
 create mode 100644 packages/discord-bot/WICK_BOT_SETUP.md
 create mode 100644 packages/discord-bot/package.json
 create mode 100644 packages/discord-bot/src/commands/contract.ts
 create mode 100644 packages/discord-bot/src/commands/index.ts
 create mode 100644 packages/discord-bot/src/commands/info.ts
 create mode 100644 packages/discord-bot/src/commands/mod.ts
 create mode 100644 packages/discord-bot/src/commands/party.ts
 create mode 100644 packages/discord-bot/src/commands/player.ts
 create mode 100644 packages/discord-bot/src/commands/setup.ts
 create mode 100644 packages/discord-bot/src/commands/verify.ts
 create mode 100644 packages/discord-bot/src/config.ts
 create mode 100644 packages/discord-bot/src/events/index.ts
 create mode 100644 packages/discord-bot/src/index.ts
 create mode 100644 packages/discord-bot/src/scripts/setup-server.ts
 create mode 100644 packages/discord-bot/src/services/concierge.ts
 create mode 100644 packages/discord-bot/src/services/game-api.ts
 create mode 100644 packages/discord-bot/src/services/moderation.ts
 create mode 100644 packages/discord-bot/src/services/verification.ts
 create mode 100644 packages/discord-bot/tsconfig.json
 create mode 100644 railway.json
 create mode 100644 render.yaml
 create mode 100644 tkbanner.png
 create mode 100644 vercel.json
PS C:\Users\epj33\Desktop\InnKeeper> git push
Enter passphrase for key '/c/Users/epj33/.ssh/id_ed25519':
To github.com:dutchiono/Tavernkeeper.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'github.com:dutchiono/Tavernkeeper.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
PS C:\Users\epj33\Desktop\InnKeeper> git pull
Enter passphrase for key '/c/Users/epj33/.ssh/id_ed25519':
Enter passphrase for key '/c/Users/epj33/.ssh/id_ed25519':
Auto-merging .env
CONFLICT (content): Merge conflict in .env
Auto-merging apps/web/.env
CONFLICT (content): Merge conflict in apps/web/.env
Auto-merging apps/web/__tests__/lib/contracts.test.ts
Auto-merging apps/web/app/(web)/page.tsx
CONFLICT (add/add): Merge conflict in apps/web/app/(web)/page.tsx
CONFLICT (rename/delete): apps/web/app/party/page.tsx renamed to apps/web/app/(web)/party/page.tsx in d9c80166f06c3f6075f2ba2e63c2d068690df2ca, but deleted in HEAD.
Auto-merging apps/web/app/(web)/party/page.tsx
CONFLICT (add/add): Merge conflict in apps/web/app/(web)/party/page.tsx
warning: Cannot merge binary files: apps/web/build_log.txt (HEAD vs. d9c80166f06c3f6075f2ba2e63c2d068690df2ca)
Auto-merging apps/web/build_log.txt
CONFLICT (add/add): Merge conflict in apps/web/build_log.txt
warning: Cannot merge binary files: apps/web/build_log_2.txt (HEAD vs. d9c80166f06c3f6075f2ba2e63c2d068690df2ca)
Auto-merging apps/web/build_log_2.txt
CONFLICT (add/add): Merge conflict in apps/web/build_log_2.txt
warning: Cannot merge binary files: apps/web/build_log_4.txt (HEAD vs. d9c80166f06c3f6075f2ba2e63c2d068690df2ca)
Auto-merging apps/web/build_log_4.txt
CONFLICT (add/add): Merge conflict in apps/web/build_log_4.txt
Auto-merging apps/web/components/ChatOverlay.tsx
CONFLICT (content): Merge conflict in apps/web/components/ChatOverlay.tsx
Auto-merging apps/web/components/PixelComponents.tsx
Auto-merging apps/web/components/TheOffice.tsx
CONFLICT (content): Merge conflict in apps/web/components/TheOffice.tsx
Auto-merging apps/web/components/TheOfficeMiniapp.tsx
CONFLICT (add/add): Merge conflict in apps/web/components/TheOfficeMiniapp.tsx
Auto-merging apps/web/components/TheOfficeView.tsx
CONFLICT (add/add): Merge conflict in apps/web/components/TheOfficeView.tsx
Auto-merging apps/web/components/providers/Web3Provider.tsx
CONFLICT (content): Merge conflict in apps/web/components/providers/Web3Provider.tsx
Auto-merging apps/web/lib/contracts/registry.ts
CONFLICT (content): Merge conflict in apps/web/lib/contracts/registry.ts
Auto-merging apps/web/lib/services/heroMinting.ts
CONFLICT (content): Merge conflict in apps/web/lib/services/heroMinting.ts
Auto-merging apps/web/lib/services/heroOwnership.ts
CONFLICT (content): Merge conflict in apps/web/lib/services/heroOwnership.ts
Auto-merging apps/web/lib/services/tavernKeeperService.ts
CONFLICT (content): Merge conflict in apps/web/lib/services/tavernKeeperService.ts
Auto-merging apps/web/package.json
CONFLICT (content): Merge conflict in apps/web/package.json
CONFLICT (modify/delete): apps/web/test-results/vitest-results.json deleted in HEAD and modified in d9c80166f06c3f6075f2ba2e63c2d068690df2ca.  Version d9c80166f06c3f6075f2ba2e63c2d068690df2ca of apps/web/test-results/vitest-results.json left in tree.
Auto-merging packages/contracts/.openzeppelin/unknown-10143.json
CONFLICT (content): Merge conflict in packages/contracts/.openzeppelin/unknown-10143.json
Auto-merging packages/contracts/DEPLOYMENT_INSTRUCTIONS.md
Auto-merging packages/contracts/DEPLOYMENT_TRACKER.md
CONFLICT (content): Merge conflict in packages/contracts/DEPLOYMENT_TRACKER.md
Auto-merging packages/contracts/artifacts/@openzeppelin/contracts/access/Ownable.sol/Ownable.dbg.json
CONFLICT (content): Merge conflict in packages/contracts/artifacts/@openzeppelin/contracts/access/Ownable.sol/Ownable.dbg.json
Auto-merging packages/contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.dbg.json
CONFLICT (content): Merge conflict in packages/contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.dbg.json
Auto-merging packages/contracts/artifacts/@openzeppelin/contracts/utils/Context.sol/Context.dbg.json
CONFLICT (content): Merge conflict in packages/contracts/artifacts/@openzeppelin/contracts/utils/Context.sol/Context.dbg.json
Auto-merging packages/contracts/artifacts/contracts/MockERC20.sol/MockERC20.dbg.json
CONFLICT (add/add): Merge conflict in packages/contracts/artifacts/contracts/MockERC20.sol/MockERC20.dbg.json
Auto-merging packages/contracts/artifacts/contracts/MockERC20.sol/MockERC20.json
CONFLICT (add/add): Merge conflict in packages/contracts/artifacts/contracts/MockERC20.sol/MockERC20.json
Auto-merging packages/contracts/artifacts/contracts/TavernKeeper.sol/IKeepToken.dbg.json
CONFLICT (content): Merge conflict in packages/contracts/artifacts/contracts/TavernKeeper.sol/IKeepToken.dbg.json
Auto-merging packages/contracts/artifacts/contracts/TavernKeeper.sol/TavernKeeper.dbg.json
CONFLICT (content): Merge conflict in packages/contracts/artifacts/contracts/TavernKeeper.sol/TavernKeeper.dbg.json
Auto-merging packages/contracts/artifacts/contracts/TavernKeeper.sol/TavernKeeper.json
CONFLICT (content): Merge conflict in packages/contracts/artifacts/contracts/TavernKeeper.sol/TavernKeeper.json
Auto-merging packages/contracts/cache/solidity-files-cache.json
CONFLICT (content): Merge conflict in packages/contracts/cache/solidity-files-cache.json
Auto-merging packages/contracts/cache/validations.json
Auto-merging packages/contracts/contracts/TavernKeeper.sol
CONFLICT (content): Merge conflict in packages/contracts/contracts/TavernKeeper.sol
CONFLICT (modify/delete): packages/contracts/scripts/upgrade.ts deleted in HEAD and modified in d9c80166f06c3f6075f2ba2e63c2d068690df2ca.  Version d9c80166f06c3f6075f2ba2e63c2d068690df2ca of packages/contracts/scripts/upgrade.ts left in tree.
Auto-merging packages/contracts/typechain-types/contracts/TavernKeeper.sol/TavernKeeper.ts
CONFLICT (content): Merge conflict in packages/contracts/typechain-types/contracts/TavernKeeper.sol/TavernKeeper.ts
Auto-merging packages/contracts/typechain-types/contracts/index.ts
CONFLICT (content): Merge conflict in packages/contracts/typechain-types/contracts/index.ts
Auto-merging packages/contracts/typechain-types/factories/contracts/MockERC20__factory.ts
CONFLICT (add/add): Merge conflict in packages/contracts/typechain-types/factories/contracts/MockERC20__factory.ts
Auto-merging packages/contracts/typechain-types/factories/contracts/TavernKeeper.sol/TavernKeeper__factory.ts
CONFLICT (content): Merge conflict in packages/contracts/typechain-types/factories/contracts/TavernKeeper.sol/TavernKeeper__factory.ts
Auto-merging packages/contracts/typechain-types/factories/contracts/TheCellar__factory.ts
CONFLICT (add/add): Merge conflict in packages/contracts/typechain-types/factories/contracts/TheCellar__factory.ts
Auto-merging packages/contracts/typechain-types/factories/contracts/index.ts
CONFLICT (content): Merge conflict in packages/contracts/typechain-types/factories/contracts/index.ts
Auto-merging packages/contracts/typechain-types/hardhat.d.ts
CONFLICT (content): Merge conflict in packages/contracts/typechain-types/hardhat.d.ts
Auto-merging packages/contracts/typechain-types/index.ts
CONFLICT (content): Merge conflict in packages/contracts/typechain-types/index.ts
Auto-merging pnpm-lock.yaml
CONFLICT (content): Merge conflict in pnpm-lock.yaml
Automatic merge failed; fix conflicts and then commit the result.
PS C:\Users\epj33\Desktop\InnKeeper> git push
Enter passphrase for key '/c/Users/epj33/.ssh/id_ed25519':
To github.com:dutchiono/Tavernkeeper.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'github.com:dutchiono/Tavernkeeper.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
PS C:\Users\epj33\Desktop\InnKeeper> git push
Enter passphrase for key '/c/Users/epj33/.ssh/id_ed25519':
To github.com:dutchiono/Tavernkeeper.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'github.com:dutchiono/Tavernkeeper.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
PS C:\Users\epj33\Desktop\InnKeeper> git pull
error: Pulling is not possible because you have unmerged files.
hint: Fix them up in the work tree, and then use 'git add/rm <file>'
hint: as appropriate to mark resolution and make a commit.
fatal: Exiting because of an unresolved conflict.
PS C:\Users\epj33\Desktop\InnKeeper>