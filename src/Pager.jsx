import React from 'react';

import type {
  Component,
  ComponentType,
  StatelessFunctionalComponent
} from 'react';

type ButtonProps = {
  children: number
};
type CreatePageGenerator = (ButtonComponent: ComponentType<ButtonProps>, EllipsisComponent: Component) =>
  (
    startingPageNumber: number,
    maxPageNumber: number,
    showEllipsisCb: (pageNumber: number) => boolean,
    onPageChange: (pageNumber: number) => any
  ) => Element;
const createPageGenerator: CreatePageGenerator = (ButtonComponent, EllipsisComponent) =>
  (startingPageNumber, maxPageNumber, showEllipsisCb, onPageChange) => {
    const pageButtons = [];
    for (let pageNumber = startingPageNumber; pageNumber < maxPageNumber; pageNumber += 1) {
      if (showEllipsisCb(pageNumber)) {
        pageButtons.push(<EllipsisComponent key='ellipsis' />);
        pageNumber = maxPageNumber - 2;
      } else if (pageNumber < maxPageNumber) {
        pageButtons.push(
          <ButtonComponent key={pageNumber} onClick={() => onPageChange(pageNumber)}>
            {pageNumber + 1}
          </ButtonComponent>
        );
      }
    }

    return pageButtons;
  };

type CreateLeftPageRenderer = (ButtonComponent: ComponentType<ButtonProps>, EllipsisComponent: Component) =>
  (selectedPageNumber: number, onPageChange: (pageNumber: number) => any) => Element;
const createLeftPageRenderer: CreateLeftPageRenderer = (ButtonComponent, EllipsisComponent) => {
  const generateUpTo5PageNumbers = createPageGenerator(ButtonComponent, EllipsisComponent);
  return (selectedPageNumber, onPageChange) => [
    (
      <ButtonComponent
        disabled={selectedPageNumber === 0}
        key='prev'
        onClick={() => onPageChange(selectedPageNumber - 1)}
      >
        Previous
      </ButtonComponent>
    ),
    ...generateUpTo5PageNumbers(
      0,
      selectedPageNumber,
      pageNumber => pageNumber === 2 && pageNumber + 4 <= selectedPageNumber,
      onPageChange
    )
  ];
};

type CreateRightPageRenderer = (ButtonComponent: ComponentType<ButtonProps>, EllipsisComponent: Component) =>
  (selectedPageNumber: number, numberOfPages: number, onPageChange: (pageNumber: number) => any) => Element;
const createRightPageRenderer: CreateRightPageRenderer = (ButtonComponent, EllipsisComponent) => {
  const generateUpTo5PageNumbers = createPageGenerator(ButtonComponent, EllipsisComponent);
  return (selectedPageNumber, numberOfPages, onPageChange) => [
    ...generateUpTo5PageNumbers(
      selectedPageNumber + 1,
      numberOfPages,
      pageNumber => pageNumber === selectedPageNumber + 3 && pageNumber + 2 < numberOfPages - 1,
      onPageChange
    ),
    (
      <ButtonComponent
        disabled={selectedPageNumber === numberOfPages - 1}
        key='next'
        onClick={() => onPageChange(selectedPageNumber + 1)}
      >
        Next
      </ButtonComponent>
    )
  ];
};

type ContainerProps = {
  children: Element[]
};
type PagerProps = {|
  numberOfPages: number,
  onPageChange: (pageNumber: number) => any,
  selectedPageNumber: number
|};
type CreatePager = (
  ButtonComponent: ComponentType<ButtonProps>,
  EllipsisComponent: Component,
  ContainerComponent: ComponentType<ContainerProps>
) => StatelessFunctionalComponent<PagerProps>;
const createPager: CreatePager = (ButtonComponent, EllipsisComponent, ContainerComponent) => {
  const renderLeftPageNumbers = createLeftPageRenderer(ButtonComponent, EllipsisComponent);
  const renderRightPageNumbers = createRightPageRenderer(ButtonComponent, EllipsisComponent);
  const Pager = ({ numberOfPages, onPageChange, selectedPageNumber }: PagerProps) => (
    <ContainerComponent>
      {renderLeftPageNumbers(selectedPageNumber, onPageChange)}
      <ButtonComponent disabled>
        {selectedPageNumber + 1}
      </ButtonComponent>
      {renderRightPageNumbers(selectedPageNumber, numberOfPages, onPageChange)}
    </ContainerComponent>
  );
  return Pager;
};

export default createPager;
