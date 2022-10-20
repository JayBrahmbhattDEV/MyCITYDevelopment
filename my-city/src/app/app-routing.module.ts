import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckAuthGuard } from './guards/check-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardPageModule),
    canActivate: [CheckAuthGuard],
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./about/about.module').then((m) => m.AboutPageModule),
  },
  {
    path: 'privacy',
    loadChildren: () =>
      import('./privacy/privacy.module').then((m) => m.PrivacyPageModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'add-report',
    loadChildren: () =>
      import('./add-report/add-report.module').then(
        (m) => m.AddReportPageModule
      ),
  },
  {
    path: 'search-location',
    loadChildren: () =>
      import('./search-location/search-location.module').then(
        (m) => m.SearchLocationPageModule
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsPageModule),
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then((m) => m.MapPageModule),
  },
  {
    path: 'view-report',
    loadChildren: () =>
      import('./view-report/view-report.module').then(
        (m) => m.ViewReportPageModule
      ),
  },
  {
    path: 'recent-reports',
    loadChildren: () =>
      import('./recent-reports/recent-reports.module').then(
        (m) => m.RecentReportsPageModule
      ),
  },
  {
    path: 'enable-permission',
    loadChildren: () =>
      import('./enable-permission/enable-permission.module').then(
        (m) => m.EnablePermissionPageModule
      ),
  },  {
    path: 'brief-report-view',
    loadChildren: () => import('./brief-report-view/brief-report-view.module').then( m => m.BriefReportViewPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
