import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./App.css";

interface Character {
  name: string;
  homeworld: string;
  films: string[];
}

interface Homeworld {
  name: string;
  population: string;
}

interface Film {
  title: string;
  releaseDate: string;
  openingCrawl: string;
}

const App = () => {
  const [inputValue, setinputValue] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [homeworlds, setHomeworlds] = useState<Homeworld[]>([]);
  const [films, setFilms] = useState<Film[]>([]);

  const handleSearch = async () => {
    const response = await fetch(
      `https://swapi.dev/api/people/?search=${inputValue}`
    );
    const data = await response.json();

    const characters: Character[] = data.results.map((result: any) => ({
      name: result.name,
      homeworld: result.homeworld,
      films: result.films,
    }));

    setCharacters(characters);

    const handleHomeworld = characters.map(async (character) => {
      const response = await fetch(character.homeworld);
      const data = await response.json();

      const homeworld: Homeworld = {
        name: data.name,
        population: data.population,
      };

      return homeworld;
    });

    const homeworlds = await Promise.all(handleHomeworld);
    setHomeworlds(homeworlds);
  };

  const handleCharacterClick = async (index: number) => {
    const character = characters[index];

    const filmPromises = (await Promise.all(
      character.films.map((filmUrl: string) =>
        fetch(filmUrl).then((res) => res.json())
      )
    )) as any[];

    const films: Film[] = filmPromises.map((film: any) => ({
      title: film.title,
      releaseDate: film.release_date,
      openingCrawl: film.opening_crawl.substr(0, 130),
    }));

    setFilms(films);
  };
  console.log(homeworlds);
  return (
    <div className="App">
      <div className="inputContainer">
        <input
          className="inputField"
          type="text"
          value={inputValue}
          onChange={(e) => setinputValue(e.target.value)}
        />
        <button className="submitButton" onClick={handleSearch}>
          <SearchIcon />
        </button>
      </div>

      <div className="charactersCotnainer">
        {characters.map((character, index) => (
          <div className="singleCharacter" key={index}>
            <h2
              className="characterName"
              onClick={() => handleCharacterClick(index)}
            >
              {character.name}
            </h2>
            <p>
              <strong>Homeworld name:</strong> {homeworlds[index]?.name}
            </p>
            <p>
              <strong>Homeworld population:</strong>{" "}
              {homeworlds[index]?.population}
            </p>
          </div>
        ))}
      </div>
      {films.length > 0 && (
        <div>
          <h3>Movies</h3>
          {films.map((film, index) => (
            <div className="movieContainer" key={index}>
              <h4>{film.title}</h4>
              <p>
                <strong>Release Date:</strong> {film.releaseDate}
              </p>
              <p>{film.openingCrawl}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
