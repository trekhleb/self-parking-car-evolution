import React from 'react';
import { Block } from 'baseui/block';
import { FaGithub, FaTwitter, RiFilePaper2Fill } from 'react-icons/all';
import { IconType } from 'react-icons/lib';

import { ARTICLE_LINK, GITHUB_LINK, TWITTER_LINK } from '../../constants/links';

function Footer() {
  return (
    <Block
      marginBottom="50px"
      marginTop="50px"
      display="flex"
      flexDirection="row"
      justifyContent="center"
    >
      <IconLink
        url={TWITTER_LINK}
        title="Trekhleb on Twitter"
        Icon={FaTwitter}
      />
      <IconLink
        url={GITHUB_LINK}
        title="Project on GitHub"
        Icon={FaGithub}
      />
      <IconLink
        url={ARTICLE_LINK}
        title="How the algorithm works"
        Icon={RiFilePaper2Fill}
      />
    </Block>
  );
}

type IconLinkProps = {
  url: string,
  title: string,
  Icon: IconType,
};

function IconLink(props: IconLinkProps) {
  const {url, title, Icon} = props;
  return (
    <Block marginLeft="10px" marginRight="10px">
      <a href={url} style={{color: 'black'}} title={title}>
        <Icon size={20} />
      </a>
    </Block>
  );
}

export default Footer;
