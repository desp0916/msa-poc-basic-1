import React from 'react';
import * as Globals from '../common/Globals';
import { ListArticles } from '../common/DataUtils';
import { ItemList, ItemRow } from '../common/ItemList';

export default class ArticlePage extends React.Component {

  constructor(props) {
    super(props);
    this.repository = 'articles';
    this.state = {
      items: [],
    }
  }

  componentDidMount() {
    ListArticles(Globals.PAGE_SIZE, 
      (response) => {
        // console.log(response);
        this.setState({
          items: response._embedded[this.repository],
          page: response.page,
        });
      },
      this._showErrors);
  }

  _showErrors(response) {
    showFailureMsg(Globals.ACT_QUERY);
    if (response && response.entity && response.entity.errors) {
      response.entity.errors.map(item => this.errors[item.property] = item.message);
      this.setState({errors: this.errors});
    }
  }

  _renderItemRows() {
    return (Array.isArray(this.state.items) && this.state.items.length > 0) ?
      this.state.items.map(item => 
        <ItemRow key={item.id} item={item} columns={this.columns}
         detailColumn={this.detailColumn} detailPath={this.detailPath}
          buttons={[
            <LinkContainer key={item.id+'button'} to={`${this.detailPath}/${item.id}`}><Button key={item.id+'_edit'}><Glyphicon glyph="edit" /> 修改</Button></LinkContainer>,
            <Button key={item.id+'_delete'} onClick={() => this._handleDelete(item)}><Glyphicon glyph="trash" /> 刪除</Button>
          ]}
        />
      ) : null;
  }

  render() {
    return (<div>
      <ItemList itemRows={this._renderItemRows()} />
    </div>);
  }

}
