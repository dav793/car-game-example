import { Observable, map } from 'rxjs';

export class WithLast {

    lastValue: any;

    any() {
        return <T>(src: Observable<T>): Observable<[T, T|undefined]> => {
         
            return src.pipe(
                map(srcValue => {

                    const lastValue = this.lastValue;
                    this.lastValue = srcValue;

                    return [ srcValue, lastValue ];
                })
            );

        }
    }

    filter<T>(predicate: (value: T) => boolean) {
        return (src: Observable<T>): Observable<[T, T|undefined]> => {

            return src.pipe(
                map(srcValue => {

                    const lastValue = this.lastValue;
                    if ( predicate( srcValue ) )
                        this.lastValue = srcValue;

                    return [ srcValue, lastValue ];
                })
            );

        }
    }
}
