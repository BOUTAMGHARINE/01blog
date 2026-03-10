import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent} from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel';
import { ProfileComponent } from './pages/profile/profile';

export const routes: Routes = [
    {
        path:"",
        component:LoginComponent,
        pathMatch:'full'
    },
    {path:"login",
     component:LoginComponent,
    },
    {path:"register",
     component:RegisterComponent,
    },
    {path:"home",
     component:HomeComponent,
    },
   {
    path:"admin",
    component:AdminPanelComponent,
   },
   {
    path:"profile",
    component:ProfileComponent
   }
   

];
