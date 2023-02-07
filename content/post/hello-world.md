---
title: 'Hello World'
description: 'Hello !!!, this is a post about hello world hand demo Syntax Highlight Code.'
date: '2022-06-29'
author: 'cr4i'
---

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

:::div{class="py-4"}
  ::tabs
    :::tab{name="ts" title="TypeScript"}
      ```ts
      import React from 'react';
      import { render } from 'react-dom';
      import { Provider } from 'react-redux';
      import { createStore } from 'redux';
      import { enthusiasm } from './reducers/index';
      import { StoreState } from './types/index';
      import App from './components/App';
      import './index.css';

      const store = createStore<StoreState>(enthusiasm, {
        enthusiasmLevel: 1,
        languageName: 'TypeScript',
      });

      render(
        <Provider store={store}>
          <App />
        </Provider>,
        document.getElementById('root')
      );
      ```
    :::
  ::
:::