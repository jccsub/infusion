

# Getting login to Auth0 to work

Just kind of started using react at this point so I struggled a little with some basic stuff that had little to do with Auth0 itself.

1. Make sure that [Setup a React Environment Using webpack and Babel
](https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel) demo works
1. Make sure that you make it to at least showing the Lock widget in [React Authentication](https://davidwalsh.name/react-authentication)

    Issues that occurred in doing this include:
  
    * In App.jsx, `import {Home} from './Home'` doesn't work because:
      
      * Brackets are not used in jsx: `{Home}` should be `Home`
      * jsx extension is not resolved in imports so `'./Home'` should be `'/Home.jsx'`
    * Was getting the following error:
    
      `Uncaught TypeError: Cannot read property 'props' of null`
      
      This occurs because I'm not using the React.createClass method. createClass has traditionally been used for React, but now it looks like everyone is moving towards extending React.Component which does not automatically bind `this` to properties (including methods such as my 'onClick' method) so you have to do it yourself. See:

      1. https://stackoverflow.com/a/36406525
      1. https://toddmotto.com/react-create-class-versus-component/

    * Getting the following error:

      `Uncaught ReferenceError: React is not defined`

      This is kind of obvious, but just adding it for completion. In some examples online, for the sake of brevity, they do not include the following necessary import statement in their JSX files:

      `import React from 'react';`

      