import React, { useState } from "react";
import { Layout } from "antd";
import { FormattedMessage } from "react-intl";

import Navbar from "../../components/Navbar";
import NavAside from "../../components/NavAside";
import useWindowDimensions from "../../utils/useWindowDimensions";

const { Header, Content, Footer } = Layout;

function Markup({ children }) {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);

  const toggleDrawer = (status) => {
    setVisible(status !== undefined ? !visible : status);
  };

  return (
    <Layout className="appLayout">
      <NavAside width={width} toggleDrawer={toggleDrawer} visible={visible} />
      <Layout>
        <Header className="appHeader">
          <Navbar width={width} toggleDrawer={toggleDrawer} visible={visible} />
        </Header>
        <Content className="appSection">{children}</Content>
        <Footer className="appFooter">
          <FormattedMessage id="copyright" />
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Markup;
