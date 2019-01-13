# REPO: swapi-proj

This repo contains the source code for the swapi-proj javascript app for PlayOn! Sports.


## To download:

There are two ways to get the client files;
- download and extract the zip file here:
https://github.com/themamboman/swapi-proj/archive/master.zip

- clone the github repo if you have git installed:
```
git clone https://github.com/themamboman/swapi-proj.git
```

once you have gotten the code, the folder should have this structure:

```
node_modules/
package.json
package-lock.json
README.md
starwars.js
tsconfig.json
```

(the node_modules folder is included so no need to run npm install).

## To Run:

Node.JS must be installed.  Go to this website to install Node.JS: https://nodejs.org/en/

After Node.JS is installed, then open a command line terminal, change to the directory where the starwars.js file is located, and run this command:

```
node   starwars.js   <planet_name>
```
Replace <planet_name> with a name from Star Wars, like Tatooine, or Yavin IV  (it will allow names with spaces).

## Output:

If no planet_name was included, it will error out with a warning about the proper usage of the script.

If a planet_name was included, it will first attempt to download all planets and people from the Star Wars API website (swapi.co).

The script will then create a listing of planets in object format and display this to the console output. The same will occur for the list of people found. Then, an array of unified data objects, storing the planet names with arrays of people from that planet will be created.

Finally, it will try to find the name of the planet input and then, if found, attempt to list the people from that planet, or say that no one is listed from that planet. If the planet isn't found (not in the list or not spelled correctly), it will tell the user that it isn't found in the list, and to try again.

NOTE: The name of the planet inputted is not case sensitive, and it can contain more than one word in the name (example: Mon Cala, Yavin IV).



## Conclusion

This project demonstrates:

- Javascript and Node.JS
- The ability to pull data from an external API endpoints
- The ability to parse JSON formatted data, objects and arrays
- The ability to handle user input and errors
- Handling asynchronous responses

Thank you for taking the time to look at this sample project.

David Gentry
