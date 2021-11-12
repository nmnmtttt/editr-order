import React from 'react'
import { render } from 'react-dom'

import './index.less'

const App = () => {
  return (
    <div className="example">
      {/* Welcome to Example Playground */}
      <iframe src="editor/design.html" frameBorder="0" marginWidth={0} marginHeight={0} scrolling="no"></iframe>
    </div>
  )
}

render(<App />, document.querySelector('#app'))
