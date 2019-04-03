import { distinctUntilChanged, publishReplay, refCount } from 'rxjs/operators';

export const drr = () => source$ =>
  source$.pipe(
    distinctUntilChanged(),
    publishReplay(1),
    refCount()
  );
