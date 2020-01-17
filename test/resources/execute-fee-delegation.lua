-- NOTE that this must be tested with public mode

-- should deploy with 1 aergo
-- should run with delegation fee not consume aergo of executor

function constructor()
end

function run()
end

function check_delegation()
  return true
end

abi.payable(constructor)
abi.register(run)
abi.fee_delegation(run)
