import styled from "styled-components";
import { FC, useContext, useState } from "react"
import { UserInventoryContext } from "../contexts/UserInventoryContext"
import GoldCoinImage from '../../images/gold-coin.png';
import { Button, InputNumber, Modal, Space } from "antd";
import { CaretDownOutlined, DollarTwoTone } from "@ant-design/icons";
import { ContractContext } from "../contexts/ContractContext";
import { useCallHelper } from "../../contracts";

type HeaderCoinTradeModalProps = {
    visible: boolean
    onClose: () => void
}

const MAX_OPERATION_VALUE = 1000

export const HeaderCoinTradeModal: FC<HeaderCoinTradeModalProps> = ({ visible, onClose }) => {
    const { contractSend } = useCallHelper()

    const { methods } = useContext(ContractContext)
    const { inventory, reload } = useContext(UserInventoryContext)

    const [buyingAmount, setBuyingAmount] = useState(0)
    const [sellingAmount, setSellingAmount] = useState(0)

    async function buyCoins() { 
        if (contractSend) {
            await contractSend(methods.buyCoins(buyingAmount))
            setBuyingAmount(0)
            reload()
            onClose()
        }
    }

    async function sellCoins() { 
        if (contractSend) {
            await contractSend(methods.sellCoins(sellingAmount))
            setSellingAmount(0)
            reload()
            onClose()
        }
    }

    const renderBuyUI = () => (
        <ActionContainer>
            <LeftBackground/>
            <ActionContent>
                <ActionTitle>Buy coins</ActionTitle>
                <ActionBody>
                    <Space direction="vertical" align="center" size={4}>
                        <Space align="center">
                            <DollarTwoTone twoToneColor="#52c41a" style={{ fontSize: 20, verticalAlign: 'middle' }}/>
                            <AmmountText>{ buyingAmount.toFixed(2) }</AmmountText>
                        </Space>
                        <CaretDownOutlined />
                        <Space align="center">
                            <GoldCoin/>
                            <InputNumber 
                                max={MAX_OPERATION_VALUE} 
                                min={0}
                                step={5}
                                onChange={ v => setBuyingAmount(Math.min(v, MAX_OPERATION_VALUE)) } 
                                value={ buyingAmount }
                            />
                        </Space>
                    </Space>
                    <ActionButton>
                        <Button 
                            type="primary" 
                            shape="round"
                            size="large" 
                            onClick={ buyCoins }
                            disabled={ buyingAmount <= 0 }
                        >
                            Buy
                        </Button>
                    </ActionButton>
                </ActionBody>
            </ActionContent>
        </ActionContainer>
    )

    const renderSellUI = () => (
        <ActionContainer>
            <RightBackground/>
            <RightActionContent>
                <ActionTitle>Sell coins</ActionTitle>
                <ActionBody>
                    <Space direction="vertical" align="center" size={4}>
                        <Space align="center">
                            <GoldCoin/>
                            <InputNumber 
                                max={Math.min(MAX_OPERATION_VALUE, inventory?.coins ?? 0)} 
                                min={0}
                                step={5}
                                onChange={ v => setSellingAmount(Math.min(v, MAX_OPERATION_VALUE, inventory?.coins ?? 0)) } 
                                value={ sellingAmount }
                            />
                        </Space>
                        <SellFeeContainer>
                            <CaretDownOutlined />
                            {/* <SellFeeText>
                                { (SELLING_FEE * 100).toFixed(0) }% Fee
                            </SellFeeText> */}
                        </SellFeeContainer>
                        <Space align="center">
                            <DollarTwoTone twoToneColor="#52c41a" style={{ fontSize: 20, verticalAlign: 'middle' }}/>
                            <AmmountText>{ sellingAmount.toFixed(2) }</AmmountText>
                        </Space>
                    </Space>
                    <ActionButton>
                        <Button 
                            type="primary" 
                            shape="round" 
                            size="large" 
                            onClick={ sellCoins }
                            disabled={ sellingAmount <= 0 }
                        >
                            Sell
                        </Button>
                    </ActionButton>
                </ActionBody>
            </RightActionContent>
        </ActionContainer>
    )
    
    return (
        <Modal 
            centered
            maskClosable
            visible={ visible } 
            width={600} 
            onCancel={ onClose }
            closable={ false }
            style={{ overflow: 'hidden', borderRadius: 999, padding: 0 }}
            bodyStyle={{ padding: 0 }}
            footer={ null }
        >
            <Container>
                { renderBuyUI() }
                { renderSellUI() }
            </Container>
        </Modal>
    )
}

const Container = styled.div`
    width: 100%;
    height: 250px;
    display: flex;
`

const LeftBackground = styled.div`
    width: 150%;
    height: 100%;
    position: absolute;
    left: -50%;
    transform: skew(15deg);
    border-right: 1px solid #faad14;
    background-color: #fff1b8;
    transition: .3s;
`

const RightBackground = styled.div`
    width: 150%;
    height: 100%;
    position: absolute;
    right: -50%;
    transform: skew(15deg);
    border-left: 1px solid #95de64;
    background-color: #d9f7be;
    transition: .3s;
`
const ActionContent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 10;
`
const RightActionContent = styled(ActionContent)``

const ActionTitle = styled.div`
    position: absolute;
    font-size: 24px;
    font-weight: bold;
    z-index: inherit;
    transition: .5s;
`

const ActionBody = styled.div`
    z-index: inherit;
    opacity: 0;
    transition: .5s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding-bottom: 32px;
    transform: translateY(50px);
`

const ActionButton = styled.div`
    transition: .5s;
    position: absolute;
    bottom: 16px;
`

const ActionContainer = styled.div`
    position: relative;
    width: 0;
    flex: 1;
    height: 100%;
    transition: .2s;
    &:hover {
        flex: 2;
        ${LeftBackground} {
            z-index: 5;
            box-shadow: 0px 0px 16px 0px black;
        }
        ${RightBackground} {
            z-index: 5;
            box-shadow: 0px 0px 16px 0px black;
        }
        ${ActionTitle} {
            transform: translateY(-100px);
        }
        ${ActionBody} {
            transform: translateY(0px);
            opacity: 1;
        }
        ${ActionContent} {
            padding-left: 32px;
        }
        ${RightActionContent} {
            padding-left: 0;
            padding-right: 32px;
        }
    }
`

const GoldCoin = styled.div`
    background-image: url(${GoldCoinImage});
    background-size: 32px;
    background-repeat: no-repeat;
    background-position: center;
    height: 22px;
    width: 22px;
    margin-right: 4px;
`

const SellFeeContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 8px;
`

const AmmountText = styled.div`
    font-weight: bold;
    font-size: 20px;
`
