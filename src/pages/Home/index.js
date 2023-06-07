import './home.css';
import { useState } from 'react';
import api from './../../services/api.js';
import { toast } from 'react-toastify';

function Home(){
    const[transparent, setTransparent] = useState(false);
    const[tipo, setTipo] = useState('');
    const[width, setWidth] = useState(0);
    const[height, setHeight] = useState(0);
    const[imagem, setImagem] = useState('$');
    const[imagemGerada, setImagemGerada] = useState('$');
    const[loadding, setLoadding] = useState(false);

    function createMarkup(text) { return {__html: text}; };

    async function subtmit(){

        if(imagem === '$'){
            toast.info('Selecione uma imagem!');
        }
        else{
            setLoadding(true);

            var data = JSON.stringify({
                "tipo": tipo,
                "turnTransparent": transparent === true,
                "width": width,
                "height":height,
                "Arquivo": imagem
            });
    
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://apisunsale.azurewebsites.net/api/image',
                headers: { 
                  'Content-Type': 'application/json', 
                },
                data : data
              };
    
            await api.request(config)
            .then((response) => {
                setLoadding(false);
                if(response.data.success){
                    toast.success('Imagem tratada com sucesso');
                    setImagemGerada(response.data.object.arquivo);
                }
            })
            .catch((exception) => {
                setLoadding(false);
                toast.error('Erro ao processar imagem!');
            })
        }
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }

    return(
        <div className='container'>
            <h1>Editor de Imagem</h1>
            <div className='descricaoImagem'>
                <div className='inputImage'>
                    <input type='file' multiple={false} onInput={
                        (event) =>{
                            var file = event.target.files[0];
                            var reader = new FileReader();
                            reader.onload = function (){
                                setImagem(reader.result);
                            }
                            reader.onerror = function(error){
                                alert(error);
                            }
                            reader.readAsDataURL(file);
                            setTipo(file.name.substring(file.name.lastIndexOf(".") + 1));
                        }
                    }/>
                    {
                        imagem === '$' ?
                        <>
                        </>
                        :
                        <div dangerouslySetInnerHTML={createMarkup(`<img src="${imagem}" alt="Anexo" />`)}>
                        </div>
                    }
                </div>
                <div className='inputRadio' onClick={(e) => setTransparent(!transparent)}>
                    <input type='radio' value={transparent}/><label>Deixar fundo transparente</label>
                </div>
                <div className='inputNumber'>
                    <label>Width</label><input type='number' value={width} onChange={(e) => setWidth(e.target.value)}></input>
                </div>
                <div className='inputNumber'>
                    <label>Height</label><input type='number' value={height} onChange={(e) => setHeight(e.target.value)}></input>
                </div>
                <div className='inputNumber'>
                    <button onClick={() => subtmit()}>Editar Imagem</button>
                </div>
            </div>
            {
                imagemGerada === '$' ?
                <>
                </>
                :
                <div className='imagemOut'>
                    <h1>
                        Saída:
                    </h1>
                    <div dangerouslySetInnerHTML={createMarkup(`<img src="${imagemGerada}" alt="Anexo" />`)}>
                    </div>
                    <div>
                        <button onClick={() => window.location.reload(false)}>Nova imagem</button>
                    </div>
                </div>

                
            }
        </div>
    )
}

export default Home;