import { AngularCloudAppPage } from './app.po';

describe('angular-cloud-app App', function() {
  let page: AngularCloudAppPage;

  beforeEach(() => {
    page = new AngularCloudAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
