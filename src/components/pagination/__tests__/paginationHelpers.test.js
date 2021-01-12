import { paginationHelpers } from '../paginationHelpers';

describe('PaginationHelpers', () => {
  it('should have specific functions', () => {
    expect(paginationHelpers).toMatchSnapshot('paginationHelpers');
  });

  it('should return an offset from page and perPage/limit', () => {
    expect([
      paginationHelpers.calculateOffsetFromPage(1, 10),
      paginationHelpers.calculateOffsetFromPage(2, 10),
      paginationHelpers.calculateOffsetFromPage(3, 10),
      paginationHelpers.calculateOffsetFromPage(4, 10),
      paginationHelpers.calculateOffsetFromPage(5, 10),
      paginationHelpers.calculateOffsetFromPage(6, 10),
      paginationHelpers.calculateOffsetFromPage(1, 20),
      paginationHelpers.calculateOffsetFromPage(2, 20),
      paginationHelpers.calculateOffsetFromPage(3, 20),
      paginationHelpers.calculateOffsetFromPage(4, 20),
      paginationHelpers.calculateOffsetFromPage(5, 20),
      paginationHelpers.calculateOffsetFromPage(6, 20)
    ]).toMatchSnapshot('page variations');
  });

  it('should return a page from offset and perPage/limit', () => {
    expect([
      paginationHelpers.calculatePageFromOffset(0, 10),
      paginationHelpers.calculatePageFromOffset(10, 10),
      paginationHelpers.calculatePageFromOffset(20, 10),
      paginationHelpers.calculatePageFromOffset(30, 10),
      paginationHelpers.calculatePageFromOffset(40, 10),
      paginationHelpers.calculatePageFromOffset(50, 10),
      paginationHelpers.calculatePageFromOffset(0, 20),
      paginationHelpers.calculatePageFromOffset(20, 20),
      paginationHelpers.calculatePageFromOffset(40, 20),
      paginationHelpers.calculatePageFromOffset(60, 20),
      paginationHelpers.calculatePageFromOffset(80, 20),
      paginationHelpers.calculatePageFromOffset(100, 20)
    ]).toMatchSnapshot('page variations');
  });

  it('should return a boolean indicating last page', () => {
    expect([
      { 'offset=0, perPage=10, itemCount=50': paginationHelpers.isLastPage(0, 10, 50) },
      { 'offset=10, perPage=10, itemCount=50': paginationHelpers.isLastPage(10, 10, 50) },
      { 'offset=40, perPage=10, itemCount=50': paginationHelpers.isLastPage(40, 10, 50) },
      { 'offset=50, perPage=10, itemCount=50': paginationHelpers.isLastPage(50, 10, 50) },
      { 'offset=0, perPage=20, itemCount=100': paginationHelpers.isLastPage(0, 20, 100) },
      { 'offset=80, perPage=20, itemCount=100': paginationHelpers.isLastPage(80, 20, 100) },
      { 'offset=100, perPage=20, itemCount=100': paginationHelpers.isLastPage(100, 20, 100) }
    ]).toMatchSnapshot('last page variations');
  });
});
