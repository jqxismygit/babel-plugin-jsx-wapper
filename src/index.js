const nodePath = require("path");
const uuidv4 = require("uuid/v4");
const fs = require("fs");
const pwd = process.env.PWD;

module.exports = function(babel) {
  const { types } = babel;
  const visitor = {
    JSXElement: function(path, state) {
      const { parentPath } = path;
      const { idField, wrapper, wrapped, output } = state.opts;

      if (!idField || !wrapper || !wrapped) {
        throw new Error("插件参数不正确");
      }

      const nodeName = path.node.openingElement.name.name;

      const parentNodeName =
        parentPath.node.openingElement &&
        parentPath.node.openingElement.name.name;

      if (wrapped.indexOf(nodeName) > -1 && parentNodeName !== wrapper) {
        const filename = path.hub.file.opts.filename;
        const fileParsed = nodePath.parse(filename);
        const attributes = path.node.openingElement.attributes;
        let idAttribute =
          attributes &&
          attributes.reduce(function(prev, c) {
            if (!prev) {
              prev = c.name.name === idField ? c : null;
            }
            return prev;
          }, null);

        if (!idAttribute) {
          const generatedId = fileParsed.name + "-" + uuidv4();
          idAttribute = types.jsxAttribute(
            types.jsxIdentifier(idField),
            types.stringLiteral(generatedId)
          );

          //把id属性传递给子组件
          path.node.openingElement.attributes.push(idAttribute);

          //把自动分配ID的组件输出到一个文件
          if (process.env.NODE_ENV === "production" && output) {
            fs.writeFileSync(
              pwd + output,
              generatedId + "\n",
              { flag: "a" },
              function(err) {
                if (err) {
                  throw err;
                }
              }
            );
          }
        }

        path.replaceWith(
          types.jsxElement(
            types.jSXOpeningElement(types.jSXIdentifier(wrapper), [
              idAttribute
            ]),
            types.jSXClosingElement(types.jSXIdentifier(wrapper)),
            [path.node]
          )
        );
      }
    }
  };

  return {
    visitor: visitor
  };
};
