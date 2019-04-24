const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc) {
  return `${siteConfig.baseUrl}docs/${doc}`;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} alt="Project Logo" />
  </div>
);

const ProjectTitle = () => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('yoshi.webp')} />
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl('getting-started/create-app')}>
              Getting Started
            </Button>
            <Button href={docUrl('api/configuration')}>API</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = () => (
  <Block layout="threeColumn" background="light">
    {[
      {
        content: 'No configuration required, just create and start working',
        image: imgUrl('rocket.png'),
        imageAlign: 'top',
        title: 'Zero config',
      },
      {
        content:
          'Just choose TypeScript when generating a project, or gradually migrate',
        image: imgUrl('ts.png'),
        imageAlign: 'top',
        title: 'Full TypeScript Support',
      },
      {
        content: 'Supports multiple usecases while being stable and reliable',
        image: imgUrl('lotusman.png'),
        imageAlign: 'top',
        title: 'JustWorks™',
      },
    ]}
  </Block>
);

class Index extends React.Component {
  render() {
    return (
      <div>
        <HomeSplash />
        <div className="mainContainer" />
        <Features />
      </div>
    );
  }
}

module.exports = Index;
