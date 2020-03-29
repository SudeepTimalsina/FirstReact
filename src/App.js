import React, {useEffect, useState} from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';


function App() {
  const [bio, setBio] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  async function fetchBio() {
    await axios("http://localhost:8080/api/bio")
    .then(res => {
      setBio(res.data.data);
    })
    .catch(error => {
      alert(error);
    })
  }

  useEffect(() => {
    fetchBio();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isEdit) {
      postBio();
    } else {
      updateBio(selectedId);
    }
  }

  async function postBio() {
    await axios({
      method: 'post',
      url: 'http://localhost:8080/api/bio',
      data: {
        name: name,
        email: email,
        phone: phone,
        address: address
      }
    })
    .then(res => {
      setBio([...bio, res.data.data]);
      alert('Bio Added Successfully')
    })
    .catch(error => {
      alert(error);
    })
  }

  async function updateBio(id) {
    await axios({
      method: 'put',
      url: `http://localhost:8080/api/bio/${id}`,
      data: {
        name: name,
        email: email,
        phone: phone,
        address: address
      }
    })
    .then(res => {
      const newArray = bio.filter(x => x._id !== id);
      newArray.push(res.data.data);
      setBio(newArray);
      alert('Bio Updated Successfully')
    })
    .catch(error => {
      alert(error);
    })
  }

  const handleEdit = (event, data) => {
    setIsEdit(true)
    setName(data.name);
    setEmail(data.email);
    setPhone(data.phone);
    setAddress(data.address);
    setSelectedId(data._id);
  }

  const handleDelete = (event, id) => {
    deleteBio(id);
  }

  async function deleteBio(id) {
    await axios({
      method: 'delete',
      url: `http://localhost:8080/api/bio/${id}`,
    })
    .then(() => {
      setBio(bio.filter(x => x._id !== id));
      alert('Bio Deleted Successfully')
    })
    .catch(error => {
      alert(error);
    })
  }

  const handleReset = (event) => {
    event.preventDefault();
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setIsEdit(false);
  }

  return (
    <div className="App">
     <Container>
        <Row>
          <Col className="formContainer">
            <Row>
              <Col>
                <h3>
                  Bio Form
                </h3>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label className="labelReorder">Name</Form.Label>
                    <Form.Control type="text" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter the name" required/>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="labelReorder">Email</Form.Label>
                    <Form.Control type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter the email" required/>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="labelReorder">Phone</Form.Label>
                    <Form.Control type="text" name="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter the phone" required/>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="labelReorder">Address</Form.Label>
                    <Form.Control type="text" name="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter the address" required/>
                  </Form.Group>
                  <Row>
                    <Col>
                      <Button className="withButton" type="submit" variant="success">SAVE</Button>
                    </Col>
                    <Col>
                      <Button className="withButton" onClick={handleReset} type="button" variant="danger">Reset</Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Col>
          <Col className="listContainer">
            <Row>
              <Col>
                <h3>
                  Bio List
                 </h3>
              </Col>
            </Row>
            <Row>
              <Col>
                 <Table striped bordered hover>
                   <thead>
                     <tr>
                       <th>Name</th>
                       <th>Email</th>
                       <th>Phone</th>
                       <th>Address</th>
                       <th>Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {bio.map((data, index) => {
                       return(
                        <tr key={index}>
                          <td>{data.name}</td>
                          <td>{data.email}</td>
                          <td>{data.phone}</td>
                          <td>{data.address}</td>
                       <td>
                       <Button onClick={event => handleEdit(event, data)} variant="primary">Edit</Button>{' '}
                       <Button onClick={event => handleDelete(event, data._id)} variant="danger">Del</Button>
                       </td>
                      </tr>
                       )
                     }
                     )}
                   </tbody>
                 </Table>
              </Col>
            </Row>
          </Col>
        </Row>
     </Container>
    </div>
  );
}

export default App;
