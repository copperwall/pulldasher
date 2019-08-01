import { PullQueue } from '../pull-queue';

describe('Pull Queue', () => {
    it ('should emit a changed pull immediately when not paused', () => {
        const pullQueue = new PullQueue();
        const observer = jest.fn();

        pullQueue.on('pullsChanged', observer);
        pullQueue.markPullAsDirty('github/github', 1000);

        expect(observer).toHaveBeenCalledTimes(1);
        expect(observer).toHaveBeenCalledWith([{ repo: 'github/github', number: 1000 }]);
    });

    it ('should wait to emit a changed pull when paused', () => {
        const pullQueue = new PullQueue();
        const observer = jest.fn();

        pullQueue.pause();
        pullQueue.on('pullsChanged', observer);
        pullQueue.markPullAsDirty('github/github', 1000);

        expect(observer).toHaveBeenCalledTimes(0);
    });

    it ('should wait until resumed to emit a changed pull when paused', () => {
        const pullQueue = new PullQueue();
        const observer = jest.fn();

        pullQueue.pause();
        pullQueue.on('pullsChanged', observer);
        pullQueue.markPullAsDirty('github/github', 1000);
        pullQueue.resume();

        expect(observer).toHaveBeenCalledTimes(1);
        expect(observer).toHaveBeenCalledWith([{ repo: 'github/github', number: 1000 }]);
    });

    it ('should wait until resumed to emit all changed pulls when paused', () => {
        const pullQueue = new PullQueue();
        const observer = jest.fn();

        pullQueue.pause();
        pullQueue.on('pullsChanged', observer);
        pullQueue.markPullAsDirty('github/github', 1000);
        pullQueue.markPullAsDirty('facebook/react', 2000);
        pullQueue.markPullAsDirty('graphql/dataloader', 3000);
        pullQueue.resume();

        expect(observer).toHaveBeenCalledTimes(1);
        expect(observer).toHaveBeenCalledWith([
            { repo: 'github/github', number: 1000 },
            { repo: 'facebook/react', number: 2000 },
            { repo: 'graphql/dataloader', number: 3000 }
        ]);
    });

    it ('should clear queued pulls after resumed', () => {
        const pullQueue = new PullQueue();
        const observer = jest.fn();

        pullQueue.pause();
        pullQueue.on('pullsChanged', observer);
        pullQueue.markPullAsDirty('github/github', 1000);
        pullQueue.markPullAsDirty('facebook/react', 2000);
        pullQueue.markPullAsDirty('graphql/dataloader', 3000);
        pullQueue.resume();

        expect(observer).toHaveBeenCalledTimes(1);
        expect(observer).toHaveBeenCalledWith([
            { repo: 'github/github', number: 1000 },
            { repo: 'facebook/react', number: 2000 },
            { repo: 'graphql/dataloader', number: 3000 }
        ]);

        observer.mockReset();
        pullQueue.markPullAsDirty('ifixit/pulldasher', 4000);

        expect(observer).toHaveBeenCalledTimes(1);
        expect(observer).toHaveBeenCalledWith([{ repo: 'ifixit/pulldasher', number: 4000 }]);
    });
});
