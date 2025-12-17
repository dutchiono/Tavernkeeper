import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as partyServiceModule from '@/lib/services/partyService';
import * as supabaseModule from '@/lib/supabase';
import * as contractsModule from '@/lib/contracts/registry';

vi.mock('@/lib/supabase');
vi.mock('@/lib/contracts/registry');

describe('partyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock contract registry
    (contractsModule.getContractAddress as any) = vi.fn().mockReturnValue('0xAdventurerContract');
  });

  describe('createParty', () => {
    it('should create a party successfully', async () => {
      const mockParty = {
        id: 'party-123',
        owner_id: 'user-456',
        dungeon_id: null,
        status: 'waiting' as const,
        max_members: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabaseModule.supabase.from as any) = vi.fn()
        .mockReturnValueOnce({
          // Party creation
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockParty, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          // Member insertion (if initialHeroTokenIds provided)
          insert: vi.fn().mockResolvedValue({ error: null }),
        });

      const result = await partyServiceModule.createParty('user-456');

      expect(result).toEqual(mockParty);
      expect(supabaseModule.supabase.from).toHaveBeenCalledWith('parties');
    });

    it('should create a party with initial heroes', async () => {
      const mockParty = {
        id: 'party-123',
        owner_id: 'user-456',
        dungeon_id: 'dungeon-789',
        status: 'waiting' as const,
        max_members: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let memberInsertCalled = false;
      (supabaseModule.supabase.from as any) = vi.fn()
        .mockReturnValueOnce({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockParty, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          insert: vi.fn().mockImplementation(() => {
            memberInsertCalled = true;
            return Promise.resolve({ error: null });
          }),
        });

      const result = await partyServiceModule.createParty(
        'user-456',
        'dungeon-789',
        ['hero-1', 'hero-2']
      );

      expect(result).toEqual(mockParty);
      expect(memberInsertCalled).toBe(true);
      expect(supabaseModule.supabase.from).toHaveBeenCalledWith('party_members');
    });

    it('should return null if contract address not configured', async () => {
      (contractsModule.getContractAddress as any) = vi.fn().mockReturnValue(null);

      const result = await partyServiceModule.createParty('user-456');

      expect(result).toBeNull();
    });

    it('should return null on database error', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      });

      const result = await partyServiceModule.createParty('user-456');

      expect(result).toBeNull();
    });

    it('should still return party if member insertion fails', async () => {
      const mockParty = {
        id: 'party-123',
        owner_id: 'user-456',
        dungeon_id: null,
        status: 'waiting' as const,
        max_members: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabaseModule.supabase.from as any) = vi.fn()
        .mockReturnValueOnce({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockParty, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({
            error: { message: 'Member insertion failed' },
          }),
        });

      const result = await partyServiceModule.createParty(
        'user-456',
        undefined,
        ['hero-1']
      );

      // Should still return party even if members fail
      expect(result).toEqual(mockParty);
    });
  });

  describe('getParty', () => {
    it('should get a party by ID', async () => {
      const mockParty = {
        id: 'party-123',
        owner_id: 'user-456',
        dungeon_id: null,
        status: 'waiting' as const,
        max_members: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockParty, error: null }),
          }),
        }),
      });

      const result = await partyServiceModule.getParty('party-123');

      expect(result).toEqual(mockParty);
      expect(supabaseModule.supabase.from).toHaveBeenCalledWith('parties');
    });

    it('should return null if party not found', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      });

      const result = await partyServiceModule.getParty('party-123');

      expect(result).toBeNull();
    });
  });

  describe('getUserParties', () => {
    it('should get all parties for a user', async () => {
      const mockParties = [
        {
          id: 'party-1',
          owner_id: 'user-456',
          dungeon_id: null,
          status: 'waiting' as const,
          max_members: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'party-2',
          owner_id: 'user-456',
          dungeon_id: 'dungeon-789',
          status: 'ready' as const,
          max_members: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockParties, error: null }),
          }),
        }),
      });

      const result = await partyServiceModule.getUserParties('user-456');

      expect(result).toEqual(mockParties);
      expect(supabaseModule.supabase.from).toHaveBeenCalledWith('parties');
    });

    it('should return empty array on error', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      });

      const result = await partyServiceModule.getUserParties('user-456');

      expect(result).toEqual([]);
    });
  });

  describe('joinParty', () => {
    it('should add a member to a party', async () => {
      (supabaseModule.supabase.from as any) = vi.fn()
        .mockReturnValueOnce({
          // getParty call
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'party-456', status: 'waiting', max_members: 5, dungeon_id: null },
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          // getPartyMembers call
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [{ id: 'member-1' }],
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          // Insert new member
          insert: vi.fn().mockResolvedValue({ error: null }),
        })
        .mockReturnValueOnce({
          // getPartyMembers call after join
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [{ id: 'member-1' }, { id: 'member-2' }],
              error: null,
            }),
          }),
        });

      const result = await partyServiceModule.joinParty(
        'party-456',
        'user-789',
        'hero-1',
        '0xAdventurerContract'
      );

      expect(result).toEqual({ success: true });
    });

    it('should return success: false if party not found', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      });

      const result = await partyServiceModule.joinParty(
        'party-456',
        'user-789',
        'hero-1',
        '0xAdventurerContract'
      );

      expect(result).toEqual({ success: false });
    });

    it('should return success: false if party is full', async () => {
      (supabaseModule.supabase.from as any) = vi.fn()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'party-456', status: 'waiting', max_members: 5, dungeon_id: null },
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: [
                { id: 'member-1' },
                { id: 'member-2' },
                { id: 'member-3' },
                { id: 'member-4' },
                { id: 'member-5' },
              ],
              error: null,
            }),
          }),
        });

      const result = await partyServiceModule.joinParty(
        'party-456',
        'user-789',
        'hero-1',
        '0xAdventurerContract'
      );

      expect(result).toEqual({ success: false });
    });

    it('should return success: false if party status is not waiting', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'party-456', status: 'in_progress', max_members: 5, dungeon_id: null },
              error: null,
            }),
          }),
        }),
      });

      const result = await partyServiceModule.joinParty(
        'party-456',
        'user-789',
        'hero-1',
        '0xAdventurerContract'
      );

      expect(result).toEqual({ success: false });
    });
  });

  describe('leaveParty', () => {
    it('should remove a member from a party', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      });

      const result = await partyServiceModule.leaveParty('party-456', 'user-789');

      expect(result).toBe(true);
      expect(supabaseModule.supabase.from).toHaveBeenCalledWith('party_members');
    });

    it('should return false on error', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: { message: 'Database error' },
            }),
          }),
        }),
      });

      const result = await partyServiceModule.leaveParty('party-456', 'user-789');

      expect(result).toBe(false);
    });
  });

  describe('updateParty', () => {
    it('should update party', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });

      const result = await partyServiceModule.updateParty('party-456', { status: 'ready' });

      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: 'Database error' },
          }),
        }),
      });

      const result = await partyServiceModule.updateParty('party-456', { status: 'ready' });

      expect(result).toBe(false);
    });
  });

  describe('generateInviteCode', () => {
    it('should generate and save an invite code', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { code: 'ABC123' },
              error: null,
            }),
          }),
        }),
      });

      const result = await partyServiceModule.generateInviteCode('party-456', 'user-789');

      expect(result).toBe('ABC123');
      expect(supabaseModule.supabase.from).toHaveBeenCalledWith('party_invites');
    });

    it('should return null on error', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      });

      const result = await partyServiceModule.generateInviteCode('party-456', 'user-789');

      expect(result).toBeNull();
    });
  });

  describe('getPartyMembers', () => {
    it('should get all members of a party', async () => {
      const mockMembers = [
        {
          id: 'member-1',
          party_id: 'party-456',
          user_id: 'user-789',
          hero_token_id: 'hero-1',
          hero_contract_address: '0xAdventurerContract',
          joined_at: new Date().toISOString(),
        },
      ];

      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: mockMembers, error: null }),
        }),
      });

      const result = await partyServiceModule.getPartyMembers('party-456');

      expect(result).toEqual(mockMembers);
    });

    it('should return empty array on error', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      });

      const result = await partyServiceModule.getPartyMembers('party-456');

      expect(result).toEqual([]);
    });
  });

  describe('startRun', () => {
    it('should start a run for a party', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });

      const result = await partyServiceModule.startRun('party-456', 'dungeon-789');

      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: 'Database error' },
          }),
        }),
      });

      const result = await partyServiceModule.startRun('party-456', 'dungeon-789');

      expect(result).toBe(false);
    });
  });

  describe('deleteParty', () => {
    it('should delete a party', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });

      const result = await partyServiceModule.deleteParty('party-456');

      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      (supabaseModule.supabase.from as any) = vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: { message: 'Database error' },
          }),
        }),
      });

      const result = await partyServiceModule.deleteParty('party-456');

      expect(result).toBe(false);
    });
  });
});

