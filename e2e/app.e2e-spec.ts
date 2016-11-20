import { ANGULARREDUXPage } from './app.po';

describe('angular-redux App', function() {
  let page: ANGULARREDUXPage;

  beforeEach(() => {
    page = new ANGULARREDUXPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
