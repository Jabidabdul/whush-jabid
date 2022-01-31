# Whush_Chrome_Extension

A chrome extension for managing bookmarks

- Clone the repo.

  ```shell
  git clone https://github.com/NKGUPTA26/whoosh-extension.git
  ```

- Build the project.

```shell
npm install
npm run build-react
npm run build-others
```

Once the above steps are performed `dist` directory will be created in your project structure.

# Installing on Chrome

- Load the extension into Google Chrome as an Unpacked Extension:
- Navigate to (1a) chrome://extensions or (1b) select Menu > More Tools > Extensions.
- Enable the (2) developer mode at top right.
- Click (3) "Load Unpacked Extension".
- Navigate to the dist directory created after follwing the above steps.  
  For additional help, refer the [official guide for Chrome](https://developer.chrome.com/extensions/getstarted#unpacked).

# Local Developement

- Follow installation instructions and install the extension.
- Work on the code.
- Use Reload (Ctrl+R) to reload the extension from chrome://extensions page.
- Test the new changes.
