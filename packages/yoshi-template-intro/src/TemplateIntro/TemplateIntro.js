import React from 'react';
import PropTypes from 'prop-types';
import Logo from '../Logo';
import s from './TemplateIntro.scss';

const Link = ({ label, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
};

const YoshiEgg = () => (
  <div className={s.eggWrapper}>
    <Logo />
    <div className={s.partLeft} />
    <div className={s.partRight} />
  </div>
);

class TemplateIntro extends React.Component {
  static propTypes = {
    t: PropTypes.func,
  };

  render() {
    return (
      <div className={s.intro}>
        <YoshiEgg />

        <p className={s.description}>
          Please check out{' '}
          <Link
            label="yoshi docs"
            link="https://wix.github.io/yoshi/docs/api/configuration"
          />
          {' and '}
          <Link
            label="fed-handbook"
            link="https://github.com/wix-private/fed-handbook#welcome-to-the-fed-handbook"
          />{' '}
          if you have any questions. <br />
          In case of some bugs or specific issues, feel free to{' '}
          <Link
            label="create an issue on github"
            link="https://github.com/wix/yoshi/issues"
          />
          {'. '}
          <br />
          <Link
            label="Join #yoshi"
            link="https://slack.com/app_redirect?channel=yoshi"
          />{' '}
          slack channel to be aware of new releases and other news.
        </p>
        <div className={s.footer}>
          <span>By yoshi team with </span>
          <span role="img" aria-label="heart">
            ❤️
          </span>
        </div>
      </div>
    );
  }
}

export default TemplateIntro;
