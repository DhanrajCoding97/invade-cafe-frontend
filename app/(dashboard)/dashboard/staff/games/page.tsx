// app/dashboard/staff/games/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GameForm from '../../components/games/GameForm';
import { useGameMutations } from '@/hooks/use-games-mutation';
import type { GameRow } from '@/types/index';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fetchGames, gameKeys } from '@/lib/queries/games';
import { GameCardSkeleton } from '@/components/skeletons/GameSkeleton';
// async function fetchGames(): Promise<GameRow[]> {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from('games')
//     .select('*')
//     .order('display_order', { ascending: true })
//     .order('created_at', { ascending: false });
//   if (error) throw new Error(error.message);
//   return data ?? [];
// }

export default function AdminGamesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameRow | undefined>();

  const { data: games = [], isLoading } = useQuery({
    queryKey: gameKeys.all,
    queryFn: fetchGames,
  });

  const { deleteMutation } = useGameMutations();

  function openAdd() {
    setEditingGame(undefined);
    setModalOpen(true);
  }

  function openEdit(game: GameRow) {
    setEditingGame(game);
    setModalOpen(true);
  }

  function handleDelete(game: GameRow) {
    if (!confirm(`Delete "${game.title}"?`)) return;

    deleteMutation.mutate(game.id, {
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Delete failed');
      },
    });
  }

  function handleFormSuccess() {
    setModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['admin-games'] });
  }

  return (
    <>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-white'>Games</h1>
        <button
          onClick={openAdd}
          className='flex items-center gap-1.5 rounded-md bg-cyan-400 px-4 py-2 text-sm font-bold text-black hover:bg-cyan-300'
        >
          <Plus className='h-4 w-4' aria-hidden='true' /> Add game
        </button>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
          {Array.from({ length: 12 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6'>
          {games.map((game) => (
            <div key={game.id} className='group relative'>
              <div className='relative aspect-3/4 overflow-hidden rounded-xl border border-cyan-400/20'>
                <Image
                  src={game.image_url}
                  alt={game.title}
                  fill
                  sizes='(max-width: 640px) 180px, (max-width: 1024px) 33vw, 25vw'
                  className='object-cover'
                />
                <div className='absolute right-0 flex items-center justify-center gap-2 '>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-label='Open Games DropDown Menu'
                        variant='icon-plain'
                        size='icon-sm'
                        className='group absolute top-3 right-3 rounded-full border border-cyan-200 bg-[#18292A] text-white/80 hover:bg-black hover:text-white hover:border-cyan-400/50 hover:shadow-[0_0_16px_rgba(34,211,238,.25)] transition-all duration-200 ease-in-out '
                      >
                        <MoreHorizontal
                          aria-hidden='true'
                          className='h-5 w-5 group-hover:motion-preset-pulse-sm'
                          color='#FFF'
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => openEdit(game)}>
                        <Pencil aria-hidden='true' />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        variant='destructive'
                        onClick={() => handleDelete(game)}
                      >
                        <Trash2 aria-hidden='true' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* <button
                    onClick={() => openEdit(game)}
                    className='rounded-full bg-cyan-400 p-2 text-black hover:bg-cyan-300'
                  >
                    <Pencil className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleDelete(game)}
                    className='rounded-full bg-red-500 p-2 text-white hover:bg-red-400'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button> */}
                </div>
              </div>
              <p className='mt-1.5 truncate text-xs text-white/70'>
                {game.title}
              </p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='max-h-[90vh] overflow-y-auto border-cyan-400/40 bg-slate-950 overflow-x-hidden'>
          <DialogHeader>
            <DialogTitle className='text-white'>
              {editingGame ? 'Edit game' : 'Add game'}
            </DialogTitle>
          </DialogHeader>
          <GameForm game={editingGame} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}
