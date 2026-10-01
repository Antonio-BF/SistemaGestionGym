import { Component, input } from '@angular/core';
import { InicialesPipe } from '@app/core/utils/iniciales.pipe';

@Component({
    selector: 'app-avatar',
    standalone: true,
    imports: [InicialesPipe], 
    template: `{{ nombre() | iniciales: apellido() }}`, // 2. Úsalo en el template
    host: { class: 'avatar', '[class.avatar--lg]': "size() === 'lg'", 'aria-hidden': 'true' },
})
export class Avatar {
    readonly nombre = input('');
    readonly apellido = input('');
    readonly size = input<'md' | 'lg'>('md');
    
}