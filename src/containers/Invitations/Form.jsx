/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Modal } from "antd";
import { FormattedMessage, useIntl } from "react-intl";

import APISetSaveInvitations from "../../actions/setSaveInvitationsSupabase";
import PageHeader from "../../components/PageHeader";
import InputEmailTags from "../../components/InputEmailTags";

const { Paragraph } = Typography;

function Form({ roundId, currentProvider }) {
  const navigate = useNavigate();
  const [mailList, setMailList] = useState([]);
  const intl = useIntl();

  const handleSendEmails = () => {
    APISetSaveInvitations(mailList, roundId, currentProvider)
      .then((status) => {
        Modal.success({
          title: `${intl.formatMessage({
            id: "invitations.functions.handleSendEmails.success.title",
          })}`,
          content: `${intl.formatMessage({
            id: "invitations.functions.handleSendEmails.success.content",
          })}`,
        });
        navigate(`/round-details?roundId=${roundId}`);
      })
      .catch((err) => {
        Modal.error({
          title: `${intl.formatMessage({
            id: "invitations.functions.handleSendEmails.error.title",
          })}`,
          content: `${intl.formatMessage({
            id: "invitations.functions.handleSendEmails.error.content",
          })}`,
        });
      });
  };

  const handlerOnChangeEmailList = (mails) => {
    setMailList(mails.target.value);
  };

  return (
    <>
      <PageHeader title={<FormattedMessage id="invitations.title" />} />
      <Paragraph>
        <FormattedMessage id="invitations.description" />
      </Paragraph>
      <Paragraph>
        <FormattedMessage id="invitations.caption" />
      </Paragraph>
      <InputEmailTags
        label={<FormattedMessage id="invitations.form.label.emails" />}
        name="email"
        placeholder={
          <FormattedMessage id="invitations.form.placeholder.emails" />
        }
        value={mailList}
        onChangeValue={handlerOnChangeEmailList}
      />
      {mailList.length > 0 && (
        <Button onClick={handleSendEmails}>
          <FormattedMessage id="commons.buttons.sendAndEnd" />
        </Button>
      )}
    </>
  );
}

export default Form;
