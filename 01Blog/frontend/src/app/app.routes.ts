import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LoginComponent} from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

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
     component:Home,
    },
   
   

];
