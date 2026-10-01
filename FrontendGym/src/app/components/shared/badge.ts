import { Component, input } from '@angular/core';
import { Tone } from '@app/models/common.model';

@Component({
    selector: 'app-badge',
    template: `<ng-content />`,
    host: { '[class]': "'badge tone-' + tone()" },
})
export class Badge {
    readonly tone = input<Tone>('gray');
}