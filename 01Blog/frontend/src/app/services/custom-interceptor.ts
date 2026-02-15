import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token");
   
  if (token){
  const cloneRequet = req.clone({
    setHeaders:{
      Authorization: `Bearer ${token}`
    }
  });


  
  return next(cloneRequet);
  }
  return next(req);
};
