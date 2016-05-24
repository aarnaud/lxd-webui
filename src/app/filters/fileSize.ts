import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name : 'lxdFileSize'
})

export class FileSizeFormatPipe implements PipeTransform {
    transform(value: number) {
        let i = -1;
        let byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
        do {
            value = value / 1024;
            i++;
        } while (value > 1024);

        return Math.max(value, 0.1).toFixed(1) + byteUnits[i];
    }
}
