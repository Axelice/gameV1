import * as React from 'react';
import { saveScriptAPI } from '../../../utils/api-facade';

const css = require('./Ships.css');

export class Ships extends React.Component<{}> {
  componentDidMount() {
    saveScriptAPI({
      code: 'let s = 0;',
      game: 'ships',
    });
  }
  render() {
    return <h1>Ships What</h1>;
  }
}
