import { Observable, map, filter } from 'rxjs';

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

                    if ( !predicate( srcValue ) )
                        return;

                    const lastValue = this.lastValue;
                    this.lastValue = srcValue;

                    return [ srcValue, lastValue ];
                }),
                filter(val => !!val),
                map(val => val as [T, T])
            );

        }
    }
}
