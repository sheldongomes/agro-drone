import Head from 'next/head'
import styles from '../styles/Home.module.css'

import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Row } from 'react-bootstrap';

export default function Home() {

  const [ rastreamentoAtivo, setRastreamentoAtivo ] = useState(false);
  const [ temperatura, setTemperatura ] = useState(7);
  const [ umidade, setUmidade ] = useState(50);

  const { register, handleSubmit } = useForm();

  const onSubmit = data => console.log(data, 'data');

  const rastrearDrone = () => {
    setRastreamentoAtivo(!rastreamentoAtivo);
  }

  useEffect(() => {
    setInterval(() => handleSubmit(onSubmit)(), 10000);
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Agro Drone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <Form.Group>
            <Form.Label>ID Drone:</Form.Label>
            <Form.Control type="text" name="drone_id" ref={register({ required: true })}></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Latitude:</Form.Label>
            <Form.Control type="number" name="latitude" ref={register({ required: true })}></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Longitude:</Form.Label>
            <Form.Control type="number" name="longitude" ref={register({ required: true })}></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Temperatura (-25º a 40º):</Form.Label>
            <Form.Control onChange={(e) => setTemperatura(e.target.value)} type="range" min="-25" max="40" defaultValue="7" name="temperatura" ref={register({ required: true })}></Form.Control> 
            <Form.Text className="text-muted">Temperatura Selecionada: {temperatura}º</Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Label>Umidade do Ar (0% a 100%):</Form.Label>
            <Form.Control onChange={(e) => setUmidade(e.target.value)} type="range" min="0" max="100" name="umidade" defaultValue="50" ref={register({ required: true })}></Form.Control>
            <Form.Text className="text-muted">Umidade Selecionada: {umidade}%</Form.Text>
          </Form.Group>

          {/*<Button className="btn btn-primary btn-block" type="submit">Enviar dados</Button>*/}
          
          <br/>
          { !rastreamentoAtivo && <Button onClick={rastrearDrone} variant="success" block type="button">Ativar Rastreamento</Button> }
          { rastreamentoAtivo && <Button onClick={rastrearDrone} variant="danger" block type="button">Destivar Rastreamento</Button> }
          
        </form>
       
      </main>

      <footer className={styles.footer}>
        Sistema de monitoramento por drone.
      </footer>
    </div>
  )
}
