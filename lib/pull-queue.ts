import { EventEmitter } from 'events';

interface QueueEntry {
   repo: string,
   number: number
}

export class PullQueue extends EventEmitter {
   private queuePaused: boolean = false;
   // TODO: Make Record<string, Pull> type
   private dirtyPulls: Set<QueueEntry> = new Set<QueueEntry>();

   markPullAsDirty(repo: string, number: number): void {
      const pullId = { repo, number };
      if (this.queuePaused) {
         this.dirtyPulls.add(pullId);
      } else {
         this.emit('pullsChanged', [pullId]);
      }
   }

   pause(): void {
      this.queuePaused = true;
   }

   resume(): void {
      this.emit('pullsChanged', [...this.dirtyPulls]);
      this.dirtyPulls.clear();
      this.queuePaused = false;
   }
}

export default new PullQueue();
