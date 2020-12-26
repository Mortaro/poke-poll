import Nullstack from 'nullstack';

class Pokemon extends Nullstack {

  // https://nullstack.app/stateful-components
  name = '';
  number = 0;
  sprite = '';
  votes = 0;
  types = [];

  // https://nullstack.app/server-functions
  // https://nullstack.app/context
  static async findPokemonByName({database, name}) {
    return await database.collection('pokemons').findOne({name});
  }

  // https://nullstack.app/context-page
  // https://nullstack.app/full-stack-lifecycle
  // https://nullstack.app/routes-and-params
  async initiate({page, params}) {
    const pokemon = await this.findPokemonByName({name: params.name});
    if(pokemon) {
      page.title = pokemon.name;
      Object.assign(this, pokemon);
    } else {
      this.name = params.name;
      page.status = 404;
    }
  }
  
  // https://nullstack.app/renderable-components
  // https://nullstack.app/instance-self
  render({environment, self}) {
    if(environment.client && !self.initiated) return false;
    return (
      <article> 
        <h1>{this.name}</h1>
        {!!this.sprite && 
          <img src={this.sprite} alt={this.name} width="96" height="96" />
        }
        {this.votes > 0 ? 
          <p> Has {this.votes} vote(s) </p> :
          <p> Noone has voted for this pokemon yet </p>
        }
        {this.types.length > 0 && 
          this.types.map((type) => <span>{type} type</span>)
        }
        {!!this.number && <p> Is the number {this.number} on the pokedex </p>}
      </article>
    )
  }

}

export default Pokemon;