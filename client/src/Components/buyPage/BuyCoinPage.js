import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import jwt_decode from 'jwt-decode';

import { useNavigate } from 'react-router-dom';
import { BuyPageData, BuyThatCoin ,BuyThatCoinForContest} from '../../Services/API';
// msg: "Invalid User"
// msg: "User Not Found"
// msg: "limit over"
// msg: "Coin Not Available"
// msg: "OK",

const BuyPage = (props) => {
    const navigate = useNavigate();
    const [Amount, set_Amount] = useState();
    const [C_Amount, set_C_Amount] = useState();
    const handelChange = (e) => {
        set_Amount(e.target.value)
    }
    const handelChange2 = (e) => {
        set_C_Amount(e.target.value)
    }
    const coin_name = useParams().type;
    console.log("params " + coin_name)

    const [pageData, set_page_data] = useState();

    const buyThatCoin = async () => {
        console.log("Buying")
        if (Amount > pageData.available_balance) {
            alert("Not enough Balanace")
            return;
        }
        const tosend = {
            coin_data: pageData.coin_data,
            Amount: Amount
        }
        const tt = await BuyThatCoin(tosend);
        if (tt) {
            console.log("buy msg -> ", tt);
            if (tt.data.error == 0) {
                navigate('/')
            }
            else {
                alert("Unable to buy this Coin")
            }
        }
        else {
            console.log("Unable to get Buy => ", tt)
        }
    }


    useEffect(() => {
        const tosend = {
            coin_name: coin_name,
        }
        const getData = async () => {
            const ReqData = await BuyPageData(tosend);
            console.log("ReqData", ReqData)
            if (ReqData) {
                set_page_data(ReqData.data);
            }
            else {
                console.log("Unable to get BuyPageData => ", ReqData)
            }
        }
        getData();

    }, []);
    if (pageData === undefined) {
        return (
            <>
                Loading
            </>
        )
    }
    return (
        <>
            {pageData.error == 1 ? (
                <div className="row justify-content-center align-items-center h-100" style={{ marginTop: '30px' }}>
                    <div className="alert alert-danger" role="alert" style={{ maxWidth: '400px' }}>
                        <h4 className="alert-heading">{pageData.msg}</h4>
                        <p>{pageData.description}</p>
                        <form action="/" method="get" style={{ textAlign: 'center' }}>
                            <button
                                className="btn btn-success btn-lg btn-block"
                                style={{ backgroundColor: '#b10707' }}
                                type="submit"
                            >
                                OK
                            </button>
                        </form>
                        <hr />
                    </div>
                </div>
            ) : (
                <div className="row">
                    <div className="col">
                        <div style={{ textAlign: 'center', paddingTop: '25px', fontSize: '2rem' }}>
                            <strong>BUYING?</strong>
                        </div>
                        <div className="container text-center">
                            <div
                                className="table-responsive"
                                style={{
                                    margin: '40px auto',
                                    maxWidth: '400px',
                                    borderStyle: 'solid',
                                    background: '#131727d9',
                                    color: 'rgb(230,230,230)',
                                }}
                            >
                                <table className="table">
                                    <thead style={{ color: 'rgb(255,255,255)', background: '#010740' }}>
                                        <tr>
                                            <th className="text-center" style={{ paddingBottom: '18px'}}>
                                                Buy Coin
                                            </th>
                                            <th/>
                                        </tr>
                                    </thead>
                                    <tbody style={{ color: 'rgb(255,255,255)' }}>
                                        <tr>
                                            <td style={{ width: '60%' }}>
                                                <input
                                                    style={{
                                                        height: '36px',
                                                        alignItems: 'center',
                                                        textAlign: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                    }}
                                                    type="text"
                                                    // readOnly
                                                    className="form-control-plaintext"
                                                    id="staticEmail"
                                                    name="bcs"
                                                    value={pageData.coin_data.symbol}
                                                />
                                                <input
                                                    style={{
                                                        height: '36px',
                                                        alignItems: 'center',
                                                        textAlign: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                    }}
                                                    type="text"
                                                    // readOnly
                                                    className="form-control-plaintext"
                                                    id="staticEmail"
                                                    name="bcn"
                                                    value={pageData.coin_data.name}
                                                />
                                            </td>
                                            <td>
                                                <img
                                                    style={{ width: '70px' }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                    data-v-996a917e=""
                                                    data-v-854cb312=""
                                                    width="26px"
                                                    src={pageData.coin_data.coinImg}
                                                    alt="Logo"
                                                    className="coin-logo"
                                                    data-v-5cd5ab5d=""
                                                ></img>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Available Balance</td>
                                            <td>₹ {pageData.available_balance}</td>
                                        </tr>
                                        <tr>
                                            <td>Buying Price</td>
                                            <td>
                                                ₹{''}
                                                <input
                                                    style={{
                                                        height: '36px',
                                                        alignItems: 'center',
                                                        textAlign: 'center',
                                                        justifyContent: 'center',
                                                        color: 'black',
                                                    }}
                                                    type="text"
                                                    // readOnly
                                                    className="form-control-plaintext"
                                                    id="staticEmail"
                                                    name="bp"
                                                    value={pageData.coin_data.currentPrice}
                                                />{' '}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Amount in Rs</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    style={{
                                                        height: '36px',
                                                        alignItems: 'center',
                                                        textAlign: 'center',
                                                        justifyContent: 'center',
                                                        color: 'rgb(0, 0, 0)',
                                                    }}
                                                    value={Amount}
                                                    onChange={handelChange}
                                                    placeholder="Enter amount"
                                                    className="form-control"
                                                    name="buyAmm"
                                                    id="inputPassword"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a className="btn btn-danger btn-lg" href="/" style={{ padding: '5px 15px' }}>
                                                    Cancel
                                                </a>{' '}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-success btn-lg btn-block"
                                                    style={{ padding: '5px 15px' }}
                                                    onClick={buyThatCoin}
                                                >
                                                    Buy!
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


















                










                </div>
            )}
            <footer>{/* Include the footer component here */}</footer>
        </>
    );


};

export default BuyPage;
