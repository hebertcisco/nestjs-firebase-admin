import { Inject } from '@nestjs/common';

import { Observable } from 'rxjs';
import { PROCESS_INSTANCE_TOKEN } from './cat.constants';
import type { CatModuleOptions } from './types';

export class CatService {
  constructor(
    @Inject(PROCESS_INSTANCE_TOKEN)
    protected readonly options: CatModuleOptions,
  ) {}
  consoleObservable(options: CatModuleOptions) {
    return this.processObservable().subscribe(subscriber => {
      const content = JSON.stringify({ ...options, ...this.options });
      subscriber.stdout.write(content);
    });
  }
  processObservable<T = any>(): Observable<NodeJS.Process> {
    return new Observable<NodeJS.Process>(subscriber => {
      subscriber.next(this.processRef);
      subscriber.complete();
      return () => {
        if (this.processRef.platform === 'win32') {
          return;
        }
      };
    });
  }

  get processRef(): NodeJS.Process {
    return process;
  }
}
