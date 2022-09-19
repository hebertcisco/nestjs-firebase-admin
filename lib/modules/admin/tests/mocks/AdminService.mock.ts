import { Subscription, Observable } from 'rxjs';
import { AdminConfig } from '../../../../index';

export class AdminServiceMock {
  consoleObservable(options: AdminConfig): Subscription {
    return this.processObservable().subscribe(subscriber => {
      const content = JSON.stringify({ ...options });
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
  get processRef() {
    return process;
  }
}
