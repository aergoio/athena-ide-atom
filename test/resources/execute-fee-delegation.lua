-- should run with delegation fee not consume aergo of executor

function run()
end

function check_delegation()
  return true
end

abi.register(run)
abi.fee_delegation(run)
