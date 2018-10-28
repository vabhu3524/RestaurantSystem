import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HttpService,ConfigGlobal } from './services/http.service';
import {MatFormFieldModule,MatSelectModule,MatInputModule,MatButtonModule} from '@angular/material';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatFormFieldModule,MatSelectModule,
        MatInputModule,MatButtonModule
    ],
    providers: [HttpService,
        {
            provide:APP_INITIALIZER,
            useFactory:ConfigGlobal,
            deps:[HttpService],multi:true

        }],
    bootstrap: [AppComponent],
    entryComponents: []
})
export class AppModule { }
