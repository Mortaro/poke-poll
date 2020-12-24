import Nullstack from 'nullstack';

class Offline extends Nullstack {
  
  // https://nullstack.app/renderable-components
  // https://nullstack.app/service-worker
  render() {
    return (
      <div> 
        <h1> You appear to have no connection </h1>
        <p> The page will reload once you go back online. </p>
      </div>
    )
  }

}

export default Offline;