import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UserListPage } from './user-list/user-list.page';
import { AdminDashboardPage } from './admin-dashboard/admin-dashboard.page';

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
    path: 'admin-panel',
    component: AdminDashboardPage
  },
  {
    path: 'all-users',
    component: UserListPage
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
  },
  {
    path: 'add-report-sucess',
    loadChildren: () => import('./add-report-sucess/add-report-sucess.module').then(m => m.AddReportSucessPageModule)
  },
  {
    path: 'permissions',
    loadChildren: () => import('./shared/modals/permissions/permissions.module').then(m => m.PermissionsPageModule)
  },
  {
    path: 'user-list',
    loadChildren: () => import('./user-list/user-list.module').then( m => m.UserListPageModule)
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.module').then( m => m.AdminDashboardPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
