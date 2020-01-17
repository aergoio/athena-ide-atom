-- should deploy with 1 aergo is sent to contract
-- (check with 'aergocli getstate --address {contract_address}')

function constructor()
end

abi.payable(constructor)
