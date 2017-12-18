# stateless-react-pager@0.0.1
This is a higher-order component for creating a React component for paging data.
As a user of this library, you provide the component for the page buttons, ellipsis, and the container which holds everything.
The library provides the general mechanism for how those 3 components should work together as a pager.

## Using the library
The default export of this library is `createPager`. The method takes 3 arguments, a button component, ellipsis component, and container component.
The button component must be a component that takes a number as children.
The ellipsis component has no props.
The container component takes an array of elements as children.
When called, `createPager` will return a new React component which has the props:
  - numberOfPages: number
  - onPageChange: (pageNumber: number) => any,
  - selectedPageNumber: number

```javascript
const Button = ({ children, ...props }) =>
  <button {...props} className='btn btn-default'>{children}</button>;
const Ellipsis = props =>
  <button {...props} className='btn btn-default' disabled>...</button>;
const Container = ({ children }) =>
  <div style={{ display: 'flex', 'justify-content': 'center' }}>{children}</div>;

const Pager = createPager(Button, Ellipsis, Container);

const render = () =>
  <Pager numberOfPages={50} onPageChange={pageChangeHandler} selectedPageNumber={23} />;
```
