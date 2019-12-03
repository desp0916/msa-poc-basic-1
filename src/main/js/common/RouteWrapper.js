/**
 * 將 Component 用 Route 包起來，以便取得 routeProps
 * 
 * https://reacttraining.com/react-router/web/api/Route/render-func
 *
 * For example,
 * 
 *  import ArticleForm from '../form/ArticleForm';
 * 
 *  <RouteWrapper path={`${this.detailPath}/:itemId`} component={ArticleForm} />
 *
 * @author Gary Liu <gary_liu@pic.net.tw>
 * @since  Thu Jan 12 10:45:22 CST 2017
 * @flow
 */

import { Route, Switch } from 'react-router-dom';

export default function RouteWrapper({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps => (
        <Component {...routeProps} />
      )}
    />
  );
}