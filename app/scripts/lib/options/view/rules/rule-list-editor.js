/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import _ from "lodash";
import React, { PropTypes } from "react";
import RuleList from "./rule-list";

export default class RuleListEditor extends React.Component {
  static propTypes = {
    rules: PropTypes.arrayOf(PropTypes.object).isRequired,
    onReady: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleEditorReady = this.handleEditorReady.bind(this);
  }

  componentWillMount() {
    this.editors = {};
    this.editorCount = 0;
  }

  handleEditorReady(ruleKey, editor) {
    this.editors[ruleKey] = editor;
    this.editorCount++;
    if (this.editorCount === this.props.rules.length) {
      this.props.onReady(this);
    }
  }

  validate() {
    let errors = [];
    let location;
    _.each(this.editors, (editor, ruleKey) => {
      if (this.refs.ruleList.isRuleEnabled(ruleKey)) {
        errors = errors.concat(editor.validate());
        if (errors.length > 0 && !location) {
          location = `#rule-item-${ruleKey}`;
        }
      }
    });
    if (location) errors.location = location;
    return errors;
  }
  serialize() {
    const serialized = {};
    const ruleList = this.refs.ruleList;
    _.each(this.editors, (editor, ruleKey) => {
      if (ruleList.isRuleEnabled(ruleKey)) {
        serialized[ruleKey] = {
          options: editor.serialize(),
          severity: ruleList.getRuleSeverity(ruleKey),
        };
      }
    });
    return serialized;
  }

  render() {
    return (
      <RuleList
        ref="ruleList"
        rules={this.props.rules}
        onEditorReady={this.handleEditorReady}
      />
    );
  }
}
