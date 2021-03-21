<h2>Open Data Teluk Tomini API</h2>
<h4>Requirements:</h4>

<ul>
    <li>MongoDB</li>
    <li>NodeJS</li>
</ul>

<h4>How To Use:</h4>

<ul>
    <li>Clone this repository on your system</li>
    <li>Copy <strong>.env.example</strong> file to <strong>.env</strong></li>
    <li>Setup <strong>.env</strong> variables</li>
    <li>Run <strong>npm install</strong></li>
    <li>Run <strong>npm run watch</strong></li>
    <li>Execute seeder in:
    <br />
    <br />
    <table style="width: 100%">
        <tbody>
            <tr>
                <td>Route:</td>
                <td>/seeder</td>
            </tr>
            <tr>
                <td>Method:</td>
                <td>POST</td>
            </tr>
            <tr>
                <td>Body</td>
                <td>
                    { "password": "string" }
                    <br />
                    * password using <strong>SEEDER_PASSWORD</strong> variable in <strong>.env</strong>
                </td>
            </tr>
        </tbody>
    </table>
    </li>
</ul>

<br />

<a href="https://github.com/erthru/open-data-teluk-tomini-web">WEB</a>
<br />
<a href="https://github.com/erthru/open-data-teluk-tomini-web-control">WEB CONTROL</a>
