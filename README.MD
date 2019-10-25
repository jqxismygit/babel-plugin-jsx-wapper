# 一个babel插件

把jsx里面某个标签用指定的标签包装起来


## 配置方法

```js
plugins: [
    [
        require.resolve("babel-plugin-jsx-wapper"),
        {
            idField: "componentId",
            wrapper: "Authorized",
            wrapped: ["Button"],
            output: "/build/generatedIds.txt"
        }
    ]
]
```

## 样例

input:

```jsx
    <Button componentId={'id'}>test</Button>
```

output:

```jsx
    <Authorized componentId={'id'}>
        <Button>test</Button>
    </Authorized>
```

## 下一步...

解决自动导入的问题

## 后续...

该组件现在主要是公司内部使用，目前和业务有耦合，后续可能会考虑通用