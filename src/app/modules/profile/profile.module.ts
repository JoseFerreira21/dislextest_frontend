import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        ProfileRoutingModule,
        CommonModule,
        ProfileRoutingModule,
        SharedModule,

        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class ProfileModule { }
