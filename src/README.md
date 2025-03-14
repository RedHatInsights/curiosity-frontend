## Modules

<dl>
<dt><a href="#Base.module_App">App</a></dt>
<dd></dd>
<dt><a href="#Base.module_AppEntry">AppEntry</a></dt>
<dd></dd>
<dt><a href="#Base.module_Bootstrap">Bootstrap</a></dt>
<dd></dd>
</dl>

<a name="Base.module_App"></a>

## App
<a name="Base.module_App..App"></a>

### App~App(props) ⇒ <code>JSX.Element</code>
Curiosity application start.
- Loads locale
- Provides authentication

**Kind**: inner method of [<code>App</code>](#Base.module_App)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>props</td><td><code>object</code></td><td></td>
    </tr><tr>
    <td>[props.getLocale]</td><td><code>reduxActions.user.getLocale</code></td><td><code>reduxActions.user.getLocale</code></td>
    </tr><tr>
    <td>[props.useDispatch]</td><td><code>storeHooks.reactRedux.useDispatch</code></td><td><code>storeHooks.reactRedux.useDispatch</code></td>
    </tr><tr>
    <td>[props.useSelector]</td><td><code>storeHooks.reactRedux.useSelector</code></td><td><code>storeHooks.reactRedux.useSelector</code></td>
    </tr>  </tbody>
</table>

<a name="Base.module_AppEntry"></a>

## AppEntry
<a name="Base.module_AppEntry..AppEntry"></a>

### AppEntry~AppEntry() ⇒ <code>JSX.Element</code>
Application entry.
- A platform required file, including how it's cased.

**Kind**: inner method of [<code>AppEntry</code>](#Base.module_AppEntry)  
<a name="Base.module_Bootstrap"></a>

## Bootstrap

* [Bootstrap](#Base.module_Bootstrap)
    * [~element](#Base.module_Bootstrap..element) : <code>HTMLElement</code>
    * [~Render](#Base.module_Bootstrap..Render) : <code>function</code>

<a name="Base.module_Bootstrap..element"></a>

### Bootstrap~element : <code>HTMLElement</code>
Find root element within HTML template.

**Kind**: inner constant of [<code>Bootstrap</code>](#Base.module_Bootstrap)  
<a name="Base.module_Bootstrap..Render"></a>

### Bootstrap~Render : <code>function</code>
Attach application to the root element, html

**Kind**: inner typedef of [<code>Bootstrap</code>](#Base.module_Bootstrap)  
